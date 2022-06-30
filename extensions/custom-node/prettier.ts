import type { PrettierConfigTransformer } from '@teambit/prettier';

export const prettierConfig = {
  tabWidth: 2,
  singleQuote: true,
  endOfLine: 'lf',
  arrowParens: 'avoid',
};

/**
 * override the Prettier default config here the check your formatting
 * @example
 * bit format --check
 * bit format
 */
export const prettierModifiers: {
  transformers: PrettierConfigTransformer[];
} = {
  transformers: [
    configMutator => {
      Object.entries(prettierConfig).map(([key, value]) => {
        configMutator.setKey(key, value);
      });
      return configMutator;
    },
  ],
};
