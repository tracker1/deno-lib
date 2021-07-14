// see if it looks and smells like an iterable object, and do accept length === 0
export function isArrayLike(item: any): boolean {
  if (Array.isArray(item)) return true;

  const len: any = item?.length;
  return typeof len === "number" && (len === 0 || (len - 1) in item);
}
