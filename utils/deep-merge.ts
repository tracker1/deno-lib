import { isArrayLike } from "./is-array-like.ts";
import { isBasicType } from "./is-basic-type.ts";

function isReplacer(a: any, b: any): boolean {
  if (isBasicType(b)) return true;
  if (isArrayLike(b)) return true;
  if (b instanceof Date) return true;
  if (b && b.__REPLACE__) return true;
  if (isBasicType(a)) return true;
  if (isArrayLike(a)) return true;
  if (a instanceof Date) return true;
  return false;
}

export function sortObject(obj: any): any {
  // simple value type, return as is
  if (isBasicType(obj)) return obj;

  // array, return map
  if (typeof obj.length === "number" && typeof obj.map === "function") {
    return obj.map(sortObject);
  }

  // date, return clone
  if (obj instanceof Date) return new Date(obj.valueOf()); // clone dates

  // return sorted object
  return Object.keys(obj)
    .sort()
    .reduce((o, k) => {
      if (obj[k] === undefined || k === "__REPLACE__") return o;
      return Object.assign(o, { [k]: sortObject(obj[k]) });
    }, {});
}

export function deepMerge(a: any, b: any): any {
  // undefined override, return original
  if (b === undefined) return sortObject(a);

  // null override, use undefined
  if (b === null) return undefined;

  if (isReplacer(a, b)) return sortObject(b);

  const aKeys: string[] = Object.keys(a);
  const bKeys: string[] = Object.keys(b);

  // return sorted object
  return [...aKeys, ...bKeys]
    .sort()
    .filter((v, i, a) => a.indexOf(v) === i)
    .reduce((o, k) => {
      const v = deepMerge(a[k], b[k]);
      return v === undefined ? o : Object.assign(o, { [k]: v });
    }, {});
}
