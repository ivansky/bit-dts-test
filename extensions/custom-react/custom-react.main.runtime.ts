import { MainRuntime } from '@teambit/cli';
import { EnvsMain, EnvsAspect, Environment } from '@teambit/envs';
import { ReactAspect, ReactMain } from '@teambit/react';
import { BuilderMain, BuilderAspect } from '@teambit/builder';
import {
  dependencies,
  prettierModifiers,
  typescriptModifiers,
  eslintModifiers,
} from '@dts-test/extensions.custom-node';
import { CustomReactAspect } from './custom-react.aspect';
import { ThemeDtsTask } from './theme-dts.task';

export class CustomReactMain {
  static slots = [];
  static dependencies: any = [EnvsAspect, ReactAspect, BuilderAspect];
  static runtime = MainRuntime;

  static composeReactEnvironment(
    envs: EnvsMain,
    react: ReactMain
  ): Environment {
    // compose env
    return react.compose([
      react.useTypescript(typescriptModifiers),
      react.useEslint(eslintModifiers),
      react.usePrettier(prettierModifiers),
      react.overrideDependencies(dependencies),
    ]);
  }

  static async provider([envs, react, builder]: [EnvsMain, ReactMain, BuilderMain]) {
    const themeDtsTask = new ThemeDtsTask(CustomReactAspect.id);
    builder.registerBuildTasks([themeDtsTask]);
    envs.registerEnv(CustomReactMain.composeReactEnvironment(envs, react));
    return new CustomReactMain();
  }
}

CustomReactAspect.addRuntime(CustomReactMain);
