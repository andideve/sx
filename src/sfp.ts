import memoize from '@emotion/memoize';
import isPropValid from '@emotion/is-prop-valid';

export default function createSfp(props: string[] = []) {
  const regex = new RegExp(`^(${props.join('|')})$`);
  return memoize((prop) => isPropValid(prop) && !regex.test(prop));
}
