import { PATH_SEPARATOR } from '../globals';
import { isObject, mergeObj, createMediaQuery, get } from '../utils';

describe('isObject', () => {
  it("[] isn't an object", () => expect(isObject([])).toBe(false));
  it('{} is an object', () => expect(isObject({})).toBe(true));
});

describe('mergeObj', () => {
  it('should return merged objects', () => {
    const object1 = {
      marginTop: '3rem',
      '@media': {
        marginTop: '6rem',
        '&:hover': { color: 'white' },
      },
    };
    const object2 = {
      padding: '1.5rem',
      '@media': {
        '&:hover': { backgroundColor: 'blue' },
      },
    };
    const expected = {
      marginTop: '3rem',
      padding: '1.5rem',
      '@media': {
        marginTop: '6rem',
        '&:hover': { color: 'white', backgroundColor: 'blue' },
      },
    };
    expect(mergeObj(object1, object2)).toEqual(expected);
  });
});

describe('createMediaQuery', () => {
  it('should return media query', () => {
    expect(createMediaQuery('1440px')).toBe('@media screen and (min-width: 1440px)');
  });
});

describe('get', () => {
  const colors = { white: 'white', gray: { '200': '#hex' } };
  const space = { 1.5: '1.5rem' };

  it('should return value of object prop (by path)', () => {
    const path = ['gray', '200'].join(PATH_SEPARATOR);
    expect(get(path, colors)).toBe(colors.gray[200]);
    expect(get('white', colors)).toBe(colors.white);
  });

  it("shouldn't parse number as path", () => {
    const path = 1.5;
    expect(get(path, space)).toBe(space['1.5']);
  });

  it('should return undefined/fallback arg', () => {
    const args = {
      string: ['gray', '300'].join(PATH_SEPARATOR),
      number: 1.5,
    };
    const object = {};

    expect(get(args.string, object)).toBe(undefined);
    expect(get(args.string, object, args.string)).toBe(args.string);

    expect(get(args.number, object)).toBe(undefined);
    expect(get(args.number, object, args.number)).toBe(args.number);
  });
});
