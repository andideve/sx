import merge from '../merge';
import system, { createMediaQuery, SystemConfig } from '..';

const config: Record<string, SystemConfig> = {
  layout: {
    d: { property: 'display' },
  },
  spacing: {
    my: { property: ['marginTop', 'marginBottom'] },
    p: { property: 'padding' },
  },
};
const parsers = {
  layout: system(config.layout),
  spacing: system(config.spacing),
};

const allParsers = merge(parsers.layout, parsers.spacing);

describe('merge', () => {
  it('should return all parser prop names', () => {
    expect(allParsers.propNames).toEqual(['d', 'my', 'p']);
  });

  it('should merge all parser results', () => {
    const props = {
      theme: { breakpoints: ['576px', '768px', '992px', '1200px'] },
      d: { _: 'none', 2: 'block' },
      my: '3rem',
      p: '1.25rem',
    };
    const expected = {
      display: props.d._,
      marginTop: props.my,
      marginBottom: props.my,
      padding: props.p,
      [createMediaQuery(props.theme.breakpoints[2])]: {
        display: props.d[2],
      },
    };

    expect(allParsers(props)).toEqual(expected);
  });
});
