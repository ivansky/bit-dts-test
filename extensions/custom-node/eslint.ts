import type { EslintConfigTransformer } from '@teambit/eslint';

/**
 * override the ESLint default config here then check your files for lint errors
 * @example
 * bit lint
 * bit lint --fix
 */
const eslintModifiers: { transformers: EslintConfigTransformer[] } = {
  transformers: [
    configMutator => {
      configMutator.addOverrides([
        {
          excludedFiles: ['*'],
          files: [],
        },
      ]);
      return configMutator;
    },
  ],
};

export { eslintModifiers };
