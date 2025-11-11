import { tasks2tags } from './tags';

describe('tasks2tags', () => {
  it('should extract all unique tags from a list of task descriptions', () => {
    const tasks = [
      {},
      { description: '#two #tags in text' },
      { description: '#duplicate' },
      { description: 'another #duplicate' }, // Should be de-duplicated
      { description: '# stray symbol' }, // Invalid: space after #
      { description: 'another # stray' }, // Invalid: space after #
      { description: '\\#dontShow' }, // Invalid: escaped #
      { description: 'no tags here' },
    ];

    const expectedTags = ['#duplicate', '#tags', '#two'];
    const result = tasks2tags(tasks);

    expect(result).toEqual(expectedTags);
  });

  it('should return an empty array if no tags are found', () => {
    const tasks = [
      { description: 'no tags at all' },
      { description: 'just some regular text' },
    ];

    expect(tasks2tags(tasks)).toEqual([]);
  });
});
