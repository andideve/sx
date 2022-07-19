import { PATH_SEPARATOR } from './globals';

export const isObject = (arg: unknown): arg is Record<string, unknown> =>
  !Array.isArray(arg) && typeof arg === 'object';

export const mergeObj = <T>(a: Record<string, unknown>, b: Record<string, unknown>): T => {
  let result = { ...a };

  Object.keys(b).forEach((key) => {
    const aVal = a[key];
    let bVal = b[key];

    if (isObject(aVal) && isObject(bVal)) {
      bVal = mergeObj(aVal, bVal);
    }

    result = { ...result, [key]: bVal };
  });

  return result as unknown as T;
};

export const createMediaQuery = (n: string) => `@media screen and (min-width: ${n})`;

/**
 * Getting value of object by path.
 */
export const get = (path: string | number, obj: object, fallback?: unknown) => {
  let result: any = { ...obj };

  if (typeof path === 'number') {
    return result[path] || fallback;
  }

  const partials = path.split(PATH_SEPARATOR);
  for (let i = 0; i < partials.length; i += 1) {
    const e = partials[i];
    if (!isObject(result) || !result[e]) {
      result = fallback;
      break;
    }

    result = result[e];
  }

  return result;
};
