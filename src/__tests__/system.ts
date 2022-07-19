import { PATH_SEPARATOR } from '../globals';
import system, {
  newSingleCSS,
  getCSSValue,
  newSingleResponsiveCSS,
  createMediaQuery,
  SystemConfig,
} from '..';

const breakpoints = ['480px', '768px', '976px', '1440px'];

describe('newSingleCSS', () => {
  it('should return css object', () => {
    expect(newSingleCSS('margin', '1rem')).toEqual({ margin: '1rem' });
  });

  it('should handle multiple prop names', () => {
    expect(newSingleCSS(['marginTop', 'marginBottom'], '1rem')).toEqual({
      marginTop: '1rem',
      marginBottom: '1rem',
    });
  });

  it('should not return undefined css value', () => {
    expect(Object.values(newSingleCSS('margin', undefined))).not.toContain(undefined);
  });
});

describe('getCSSValue', () => {
  it('should return current provided value', () => {
    expect(getCSSValue('green')).toBe('green');
  });

  it('should return value of scale/object (by path)', () => {
    const path = ['gray', '200'].join(PATH_SEPARATOR);
    const scale = { gray: { '200': '#hex' } };

    expect(getCSSValue(path, scale)).toBe(scale.gray[200]);
  });
});

describe('newSingleResponsiveCSS', () => {
  it('should return responsive css object (mobile and desktop)', () => {
    const property = 'margin';
    const value = { _: '1rem', 2: '1.5rem' };
    const expected = {
      [property]: value._,
      [createMediaQuery(breakpoints[2])]: {
        [property]: value[2],
      },
    };

    expect(newSingleResponsiveCSS(property, value, breakpoints)).toEqual(expected);
  });

  it('should parsing path value', () => {
    const property = 'margin';
    const value = { _: 3, 2: 6 };
    const scale = { 3: '3rem', 6: '6rem' };
    const expected = {
      [property]: scale[3],
      [createMediaQuery(breakpoints[2])]: {
        [property]: scale[6],
      },
    };

    expect(newSingleResponsiveCSS(property, value, breakpoints, scale)).toEqual(expected);
  });
});

describe('system', () => {
  const config: Record<string, SystemConfig> = {
    layout: {
      d: { property: 'display' },
    },
    spacing: {
      my: { property: ['marginTop', 'marginBottom'] },
      p: { property: 'padding' },
    },
    colors: {
      bgColor: { property: 'backgroundColor', scale: 'colors' },
    },
  };
  const parsers = {
    layout: system(config.layout),
    spacing: system(config.spacing),
    colors: system(config.colors),
  };

  it('should return function', () => {
    expect(typeof parsers.spacing).toBe('function');
  });

  it('should return prop names', () => {
    expect(parsers.spacing.propNames).toEqual(Object.keys(config.spacing));
  });

  it('should return css object', () => {
    const props: object = { my: '3rem', p: '1.25rem' };
    expect(parsers.spacing(props)).toEqual({
      marginTop: '3rem',
      marginBottom: '3rem',
      padding: '1.25rem',
    });
  });

  it('should return responsive css object (with path value)', () => {
    const props: object = {
      theme: {
        breakpoints,
        colors: { gray: { '200': '#200', '300': '#300' } },
      },
      my: { _: '3rem', 2: '6rem' },
      bgColor: { _: 'gray.200', 2: 'gray.300' },
    };

    expect(parsers.spacing(props)).toEqual({
      marginTop: '3rem',
      marginBottom: '3rem',
      [createMediaQuery(breakpoints[2])]: {
        marginTop: '6rem',
        marginBottom: '6rem',
      },
    });

    expect(parsers.colors(props)).toEqual({
      backgroundColor: '#200',
      [createMediaQuery(breakpoints[2])]: {
        backgroundColor: '#300',
      },
    });
  });
});
