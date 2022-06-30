import { MainRuntime } from '@teambit/cli';
import { EnvsMain, EnvsAspect, Environment } from '@teambit/envs';
import { ReactAspect, ReactMain } from '@teambit/react';
import {
  dependencies,
  prettierModifiers,
  typescriptModifiers,
  eslintModifiers,
} from '@dts-test/extensions.custom-node';
import { CustomReactAspect } from './custom-react.aspect';
// import { ThemeDtsTask } from './theme-dts.task';

export class CustomReactMain {
  static slots = [];
  static dependencies: any = [EnvsAspect, ReactAspect];
  static runtime = MainRuntime;

  static composeReactEnvironment(
    envs: EnvsMain,
    react: ReactMain
  ): Environment {
    // compose env
    return react.compose([
      // react.overrideBuildPipe([
      //   // @TODO Implement dts task
      //   // new ThemeDtsTask(CustomReactAspect.id),
      //   // keep other build tasks
      //   ...react.reactEnv.getBuildPipe(),
      // ]),
      react.useTypescript(typescriptModifiers),
      react.useEslint(eslintModifiers),
      react.usePrettier(prettierModifiers),
      react.overrideDependencies(dependencies),
    ]);
  }

  static async provider([envs, react]: [EnvsMain, ReactMain]) {
    envs.registerEnv(CustomReactMain.composeReactEnvironment(envs, react));
    return new CustomReactMain();
  }
}

CustomReactAspect.addRuntime(CustomReactMain);
