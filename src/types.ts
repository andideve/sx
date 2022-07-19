import { Theme } from '@emotion/react';
import { CSSObject } from '@emotion/serialize';

export interface SystemConfig {
  [key: string]: {
    property: string | string[];
    scale?: string;
  };
}

export interface StyleFunction {
  (props: object & { theme?: Theme }): CSSObject;
  propNames: string[];
}

export type ResponsiveValue<T = string | number> = Record<string | number, T> | T;
