import { isBasicType } from "./is-basic-type.ts";

/**
 * Creates a simple clone of a passed in value, with keys sorted.
 *
 * - Will not contain a key of "__REPLACE__", which is meant to be used with ./deep-merge.ts
 *
 * @param obj Object to clone
 * @returns Sorted/Cloned Object
 */
export function cloneSorted(obj: any): any {
  // simple value type, return as is
  if (isBasicType(obj)) return obj;

  // array, return map
  if (typeof obj.length === "number" && typeof obj.map === "function") {
    return obj.map(cloneSorted);
  }

  // date, return clone
  if (obj instanceof Date) return new Date(obj.valueOf()); // clone dates

  // return sorted object
  return Object.keys(obj)
    .sort()
    .reduce((o, k) => {
      if (obj[k] === undefined || k === "__REPLACE__") return o;
      return Object.assign(o, { [k]: cloneSorted(obj[k]) });
    }, {});
}
