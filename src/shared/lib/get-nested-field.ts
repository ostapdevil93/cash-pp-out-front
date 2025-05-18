export function getNestedField(path: string | string[], obj: object = self, separator = '.') {
  const properties = Array.isArray(path) ? path : path.split(separator);
  // @ts-ignore
  return properties.reduce((prev, curr) => prev?.[curr], obj);
}
