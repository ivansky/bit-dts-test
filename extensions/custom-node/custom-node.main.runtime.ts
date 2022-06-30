import { MainRuntime } from '@teambit/cli';
import { NodeAspect, NodeMain } from '@teambit/node';
import { EnvsAspect, EnvsMain } from '@teambit/envs';
import { CustomNodeAspect } from './custom-node.aspect';
import { prettierModifiers } from './prettier';
import { dependencies } from './dependencies';
import { typescriptModifiers } from './typescript';
import { eslintModifiers } from './eslint';

export class CustomNodeMain {
  static slots = [];

  static dependencies = [NodeAspect, EnvsAspect];

  static runtime = MainRuntime;

  static async provider([node, envs]: [NodeMain, EnvsMain]) {
    const CustomNodeEnv = node.compose([
      node.useTypescript(typescriptModifiers),
      node.useEslint(eslintModifiers),
      node.usePrettier(prettierModifiers),
      node.overrideDependencies(dependencies),
    ]);
    envs.registerEnv(CustomNodeEnv);
    return new CustomNodeMain();
  }
}

CustomNodeAspect.addRuntime(CustomNodeMain);
