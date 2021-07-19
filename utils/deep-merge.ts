import { isArrayLike } from "./is-array-like.ts";
import { isBasicType } from "./is-basic-type.ts";
import { cloneSorted } from "./clone-sorted.ts";

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

/**
 * Will deeply merge two objects into a final result.
 *
 * - Array values in update will replace base values
 * - Objects with a "__REPLACE__" property set truthy will replace base object value
 * - "__REPLACE__" key in an object will be removed from the result
 *
 * @param a base object
 * @param b update object
 * @returns Deeply merged result
 */
export function deepMerge(a: any, b: any): any {
  // undefined override, return original
  if (b === undefined) return cloneSorted(a);

  // null override, use undefined
  if (b === null) return undefined;

  if (isReplacer(a, b)) return cloneSorted(b);

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
