import { Task } from './db';

/**
 * @return string[] (i.e., all tags in task descriptions (e.g., #tag #label) while ignoring escaped, non-tags (i.e., ignore \#non-tag))
 */
export const tasks2tags = (tasks: Pick<Task, 'description'>[]) => {
  const tags = tasks.flatMap(
    (task) =>
      task.description
        /** @note ignore escaped tags denoted with a preceding backslash */
        ?.match(/(^#[^\s]+)|((?<=[^\\])#[^\s]+)/g) ?? []
  );
  /** @note de-duplicate & sort tags */
  return Array.from(new Set(tags)).sort();
};
