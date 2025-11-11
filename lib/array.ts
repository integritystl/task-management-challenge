export const toggleArrayValue = <T>(array: T[], value2toggle: T) => {
  if (!array.includes(value2toggle)) return array.concat([value2toggle]);
  return array.filter((value) => value !== value2toggle);
};
