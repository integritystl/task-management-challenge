import { toggleArrayValue } from './array';

describe('toggleArrayValue', () => {
  // Test case 1: Adding a value that is not present (strings)
  it('should add a value to the array if it is not present', () => {
    const initialArray = ['a', 'b', 'c'];
    const valueToToggle = 'd';
    const expectedArray = ['a', 'b', 'c', 'd'];

    const resultArray = toggleArrayValue(initialArray, valueToToggle);

    expect(resultArray).toEqual(expectedArray);
  });

  // Test case 2: Removing a value that is present (strings)
  it('should remove a value from the array if it is present', () => {
    const initialArray = ['a', 'b', 'c'];
    const valueToToggle = 'b';
    const expectedArray = ['a', 'c'];

    const resultArray = toggleArrayValue(initialArray, valueToToggle);

    expect(resultArray).toEqual(expectedArray);
  });

  // Test case 3: Adding a value that is not present (numbers)
  it('should correctly add numbers', () => {
    const initialArray = [1, 2, 3];
    const valueToToggle = 4;
    const expectedArray = [1, 2, 3, 4];

    const resultArray = toggleArrayValue(initialArray, valueToToggle);

    expect(resultArray).toEqual(expectedArray);
  });

  // Test case 4: Removing a value that is present (numbers)
  it('should correctly remove numbers', () => {
    const initialArray = [1, 2, 3];
    const valueToToggle = 1;
    const expectedArray = [2, 3];

    const resultArray = toggleArrayValue(initialArray, valueToToggle);

    expect(resultArray).toEqual(expectedArray);
  });

  // Test case 5: Purity check (should not mutate the original array when adding)
  it('should return a new array and not mutate the original when adding', () => {
    const initialArray = ['a', 'b'];
    const originalArrayCopy = [...initialArray]; // Keep a copy
    const valueToToggle = 'c';

    const resultArray = toggleArrayValue(initialArray, valueToToggle);

    // Check that a new array was returned
    expect(resultArray).not.toBe(initialArray);
    // Check that the original array is unchanged
    expect(initialArray).toEqual(originalArrayCopy);
  });

  // Test case 6: Purity check (should not mutate the original array when removing)
  it('should return a new array and not mutate the original when removing', () => {
    const initialArray = ['a', 'b', 'c'];
    const originalArrayCopy = [...initialArray]; // Keep a copy
    const valueToToggle = 'c';

    const resultArray = toggleArrayValue(initialArray, valueToToggle);

    // Check that a new array was returned
    expect(resultArray).not.toBe(initialArray);
    // Check that the original array is unchanged
    expect(initialArray).toEqual(originalArrayCopy);
  });

  // Test case 7: Edge case - starting with an empty array
  it('should add the value to an empty array', () => {
    const initialArray: string[] = []; // Explicitly type for empty array
    const valueToToggle = 'first';
    const expectedArray = ['first'];

    const resultArray = toggleArrayValue(initialArray, valueToToggle);

    expect(resultArray).toEqual(expectedArray);
  });

  // Test case 8: Edge case - value present multiple times
  it('should remove all instances of the value if it is present multiple times', () => {
    const initialArray = ['x', 'y', 'x', 'z', 'x'];
    const valueToToggle = 'x';
    const expectedArray = ['y', 'z']; // .filter() removes all instances

    const resultArray = toggleArrayValue(initialArray, valueToToggle);

    expect(resultArray).toEqual(expectedArray);
  });

  // Test case 9: Handling objects (referential equality)
  describe('with object references', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };

    it('should add an object if its reference is not present', () => {
      const initialArray = [obj1, obj2];
      const resultArray = toggleArrayValue(initialArray, obj3);
      expect(resultArray).toEqual([obj1, obj2, obj3]);
    });

    it('should remove an object if its reference is present', () => {
      const initialArray = [obj1, obj2, obj3];
      const resultArray = toggleArrayValue(initialArray, obj2);
      expect(resultArray).toEqual([obj1, obj3]);
    });

    it('should ADD an object even if another object with the same shape is present', () => {
      const initialArray = [obj1, obj2];
      const obj1Clone = { id: 1 }; // Same shape, different reference

      const resultArray = toggleArrayValue(initialArray, obj1Clone);

      // .includes() uses referential equality for objects, so it doesn't find
      // obj1Clone and adds it to the array.
      expect(resultArray).toEqual([obj1, obj2, obj1Clone]);
      expect(resultArray.length).toBe(3);
    });
  });
});
