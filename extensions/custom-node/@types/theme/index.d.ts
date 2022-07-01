import "styled-components";

// Expand styled components typings with base properties
declare module 'styled-components' {
  // Some base properties that is always exist
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface DefaultTheme {
    breakpoints: string[];
    media: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    fontSizes: string[];
    space: string[];
  }
}
