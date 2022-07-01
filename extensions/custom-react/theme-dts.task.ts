import {
  BuildTask,
  BuildContext,
  BuiltTaskResult,
  ComponentResult,
} from '@teambit/builder';
import { WorkspaceComponent } from '@teambit/workspace';
import path from 'path';
import { promises as fs } from 'fs';

interface LegacyId {
  readonly scope: string | null | undefined;
  readonly box: string | undefined; // what is it ???
  readonly name: string;
  readonly version: string | undefined;
}

interface WorkspaceDependency {
  id: LegacyId;
  relativePaths: any[];
  packageName?: string;
}

function getComponentPkgName(component: WorkspaceComponent): string {
  const {
    id: { scope, namespace, name },
  } = component;
  return [
    `@${scope}`.replace('.', '/'),
    namespace,
    name
  ].filter(Boolean).join('.');
}

function getComponentPkgDir(rootDir: string, component: WorkspaceComponent): string {
  return path.join(rootDir, 'node_modules', getComponentPkgName(component));
}

function getDependencies(component: WorkspaceComponent, orgName?: string): WorkspaceDependency[] {
  let deps = (component.state.dependencies.dependencies as WorkspaceDependency[]);
  if (orgName) {
    deps = deps.filter(dep => dep.packageName?.startsWith(`@${orgName}`));
  }
  return deps;
}

export class ThemeDtsTask implements BuildTask {
  constructor(readonly aspectId: string) {}

  readonly name = 'ThemeDtsTask';

  private outputFolderName = '@types';
  private outputFileName = path.join(this.outputFolderName, 'deps.theme.d.ts');

  async preBuild(context: BuildContext): Promise<void> {
    const components = context.components as WorkspaceComponent[];
    const scopeParts = components[0]?.id.scope.split('.');
    const orgName = scopeParts.length > 1 ? scopeParts[0] : undefined;
    const { capsuleNetwork } = context;
    const { capsulesRootDir } = capsuleNetwork;

    for (const component of components) {
      const dependencies = getDependencies(component, orgName);
      if (!dependencies.length) continue;

      const pkgName = getComponentPkgName(component)
      const pkgDir = getComponentPkgDir(capsulesRootDir, component);
      const declarationsOutput = path.join(pkgDir, this.outputFileName);
      const depsThemeDtsRelativePaths: string[] = [];

      for (const dep of dependencies) {
        const { name: depName } = dep.id;
        // dep.packageName = @dts-test/components.modal
        const depPkgName = dep.packageName;
        if (!depPkgName) continue;

        const depThemeDtsRelativePath = path.join(
          depPkgName,
          '@types',
          `${depName}.theme.d.ts`
        );

        const depThemeDtsAbsPath = path.join(
          capsulesRootDir,
          'node_modules',
          depThemeDtsRelativePath
        );

        try {
          const handle = await fs.open(depThemeDtsAbsPath, 'r');
          await handle.close();
        } catch (e: any) {
          if (e.code !== 'ENOENT') {
            console.error(e.message);
          }
          continue;
        }

        depsThemeDtsRelativePaths.push(depThemeDtsRelativePath);
      }

      if (!depsThemeDtsRelativePaths.length) continue;

      const pkgTypesFolder = path.join(
        capsulesRootDir,
        'node_modules',
        pkgName,
        this.outputFolderName
      );

      try {
        await fs.open(pkgTypesFolder, 'r');
      } catch (e: any) {
        if (e.code === 'ENOENT') {
          await fs.mkdir(pkgTypesFolder);
        } else {
          console.error(`\nCould not create @types folder for ${pkgName}\n`, e);
        }
      }

      const dtsOutputContent = depsThemeDtsRelativePaths
        .map(dtsPath => {
          const extLessPath = dtsPath.replace(/\.d\.ts$/, '');
          return `/// <reference types="${extLessPath}" />`
        })
        .concat("\n")
        .join("\n");

      try {
        await fs.writeFile(declarationsOutput, dtsOutputContent);
      } catch (e) {
        console.error(`\nCould not write theme dts file for ${pkgName}\n`, e);
      }
    }

  }

  async execute(context: BuildContext): Promise<BuiltTaskResult> {
    const componentsResults: ComponentResult[] = [];
    const capsules = context.capsuleNetwork.seedersCapsules;

    capsules.forEach((capsule) => {
      componentsResults.push({
        component: capsule.component,
      })
    });

    return {
      artifacts: [
        {
          generatedBy: this.aspectId,
          name: this.name,
          globPatterns: [this.outputFileName],
        },
      ],
      componentsResults,
    };
  }
}
