import { obfuscateString } from '../utils';

describe('obfuscateString()', () => {
  it('Should obfuscate long strings', () => {
    const longStr = 'loremipsumdolorsitametconsecteturadipiscingelitproinsemper';
    const numberOfVisibleChars = 5;
    const last5chars = longStr.substr(-numberOfVisibleChars);
    const stars = `*`.repeat(longStr.length - numberOfVisibleChars);
    expect(obfuscateString(longStr, numberOfVisibleChars)).toBe(stars + last5chars);
  });

  it('Should obfuscate short strings', () => {
    const shortStr = 'loremipsumdolorsi';
    expect(obfuscateString(shortStr, 2)).toBe('***************si');
  });

  it('Should obfuscate the entire string if number of visible characters is longer than string length', () => {
    const str = 'foobar';
    expect(obfuscateString(str, 5)).toBe('*oobar');
    expect(obfuscateString(str, 6)).toBe('******');
    expect(obfuscateString(str, 7)).toBe('******');
  });
});

describe('validateRequestBody()', () => {});
