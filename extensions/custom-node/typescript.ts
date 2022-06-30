import { UseTypescriptModifiers } from '@teambit/react';
import type { TsConfigTransformer } from '@teambit/typescript';

export function getTypescriptMutators(): TsConfigTransformer[] {
  return [
    tsMutator => {
      tsMutator.setCompilerOptions({
        ...tsMutator.raw.tsconfig.compilerOptions,

        // next.js typescript conf
        // target: 'es5', // target: 'es2015',
        // lib: ['dom', 'dom.iterable', 'esnext'],
        // allowJs: true,
        skipLibCheck: true,
        // strict: false, // nextjs: true
        forceConsistentCasingInFileNames: true,
        // noEmit: true,
        esModuleInterop: true,
        // module: 'esnext', // module: 'CommonJS',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        // jsx: 'preserve', // jsx: 'react',
        incremental: true,

        // additional
        allowSyntheticDefaultImports: true,
        // preserveSymlinks: false,
      });
      // tsMutator.setTarget('ES5'); // its es2015 in bit
      tsMutator.addTypes([
        // require.resolve('./node_modules/@types/node'),
        require.resolve('./@types/theme/index.d.ts'),
      ]);
      tsMutator.addExclude(['node_modules', 'dist']);

      // include @types folder
      tsMutator.raw.tsconfig.include = tsMutator.raw.tsconfig.include || [];
      tsMutator.raw.tsconfig.include.push('./@types');
      return tsMutator;
    },
  ];
}

export const typescriptModifiers: UseTypescriptModifiers = {
  buildConfig: getTypescriptMutators(),
  devConfig: getTypescriptMutators(),
};
