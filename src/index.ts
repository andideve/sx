import { CSSObject } from '@emotion/serialize';

import merge from './merge';
import createSfp from './sfp';
import { mergeObj, createMediaQuery, get, isObject } from './utils';

import { SystemConfig, StyleFunction, ResponsiveValue } from './types';

export { merge, createSfp, mergeObj, createMediaQuery, get, isObject };
export type { SystemConfig, StyleFunction, ResponsiveValue };

/**
 * Create a css-object by multiple (single) cssprop with single value.
 */
export const newSingleCSS = (props: string | string[], value: unknown) => {
  const css: CSSObject = {};
  if (typeof value === 'undefined') return css;
  (Array.isArray(props) ? props : [props]).forEach((prop) => {
    Object.assign(css, { [prop]: value });
  });

  return css;
};

/**
 * Getting cssvalue from theme-scale and `arg` set as fallback
 * when scale not found.
 */
export function getCSSValue(arg: unknown, scale = {}) {
  if (!(typeof arg === 'string' || typeof arg === 'number')) return arg;
  return get(String(arg), scale, arg);
}

export function newSingleResponsiveCSS(
  property: string | string[],
  respValue: object,
  breakpoints: string[],
  scale?: object,
): CSSObject {
  let css = {};

  Object.keys(respValue).forEach((_key) => {
    const key = _key as keyof typeof respValue;
    const value = newSingleCSS(property, getCSSValue(respValue[key], scale));

    if (key === '_') {
      css = mergeObj(css, value);
      return;
    }

    if (!breakpoints.length) {
      console.error('No breakpoints provided.');
      return;
    }
    if (typeof breakpoints[key] !== 'string') {
      console.error('Breakpoint must be string.');
      return;
    }

    css = mergeObj(css, { [createMediaQuery(breakpoints[key])]: value });
  });

  return css;
}

const system = (config: SystemConfig) => {
  const propNames = Object.keys(config);

  const sF: StyleFunction = (allProps) => {
    const theme = (allProps.theme || {}) as Record<string, unknown>;
    const breakpoints = (theme.breakpoints || []) as string[];

    let css: CSSObject = {};

    function buildCSS(_propNames: string | string[]) {
      const propNames = _propNames as keyof typeof allProps;
      const { property, scale } = config[propNames];
      const value = allProps[propNames];
      const themeScale = scale && get(scale, theme);

      if (typeof value === 'undefined') return;
      if (isObject(value)) {
        css = mergeObj(css, newSingleResponsiveCSS(property, value, breakpoints, themeScale));
      } else {
        css = mergeObj(css, newSingleCSS(property, getCSSValue(value, themeScale)));
      }
    }

    Object.keys(allProps)
      .filter((_prop) => {
        const prop = _prop as keyof typeof allProps;
        return typeof allProps[prop] !== 'undefined' && propNames.includes(prop);
      })
      .forEach(buildCSS);

    return css;
  };

  sF.propNames = propNames;

  return sF;
};

export { system };
export default system;
