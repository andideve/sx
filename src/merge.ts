import { CSSObject } from '@emotion/serialize';

import { mergeObj } from './utils';
import { StyleFunction } from './types';

/**
 * Merge all style-function results into single css-object.
 */
export default function merge(...sFs: StyleFunction[]) {
  const propNames = sFs.map((sF) => sF.propNames).flat();

  const mergedSF: StyleFunction = (props) => {
    let css: CSSObject = {};
    sFs.forEach((sF) => {
      css = mergeObj(css, sF(props));
    });

    return css;
  };

  mergedSF.propNames = propNames;

  return mergedSF;
}
