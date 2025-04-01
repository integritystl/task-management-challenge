import { HELLO_WORLD } from '@/lib/const';

describe('helloWorld function', () => {
  test('returns "Hello, World!"', () => {
    expect(HELLO_WORLD).toBe('Hello, World!');
  });
});
