export function isBasicType(obj: any): boolean {
  const t = (typeof obj).trim().toLowerCase();
  if (
    obj === null ||
    t === "undefined" ||
    t === "boolean" ||
    t === "number" ||
    t === "string" ||
    t === "function"
  ) {
    return true;
  }
  return false;
}
