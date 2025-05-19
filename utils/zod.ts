export const formatEnumForZodSchema = <
  V extends string,
  E extends object = Record<string, V>
>(
  enumeration: E
): [V, ...V[]] => {
  const enumValues = Object.values(enumeration)

  if (!enumValues.length) {
    throw Error('Enumeration cannot be empty.')
  }

  return [enumValues[0], ...enumValues.slice(1)]
}
