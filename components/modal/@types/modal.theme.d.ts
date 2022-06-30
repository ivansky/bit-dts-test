import { CSSObject } from "styled-components";

declare module 'styled-components' {
  // @ts-ignore
  // import { DefaultTheme } from 'styled-components';

  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface DefaultTheme {
    modals: {
      commonModal: CSSObject;
    };
  }
}
