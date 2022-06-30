import type { EnvPolicyConfigObject } from '@teambit/dependency-resolver';

/**
 * override dependencies here
 * @example
 * Uncomment types to include version 17.0.3 of the types package
 */
export const dependencies: EnvPolicyConfigObject = {
  devDependencies: {
    '@types/node': '16.11.27',
    '@types/react': '16.14.11',
    '@types/react-dom': '16.9.14',
    '@types/styled-components': '5.1.9',
    typescript: '4.6.4',
  },
  dependencies: {
    react: '16.14.0',
    'react-dom': '16.14.0',
  },
};
