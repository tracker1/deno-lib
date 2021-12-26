import { isArrayLike } from "./is-array-like.ts";

/**
 * Specific value to used if the intention is to clear the result from output.
 */
export const skipValue = Symbol("undefined");

/**
 * Will create a cloned copy of the input object.
 *
 * @param input Object to Clone
 * @param circularValue Replacement to use for circular references (default: '[Circular]') for undefined/skip use skipValue export
 * @param refs Circular reference lookup table (optional)
 * @returns Clone of original input.
 */
export function clone<T>(input: T, circularValue?: any, refs?: T[]): T {
  const obj: any = input;
  if (obj === undefined) {
    const r: any = null;
    return r;
  }
  if (!obj || "object" !== typeof obj) return obj;

  if (obj instanceof Date) {
    const r: any = new Date(obj.valueOf());
    return r;
  }

  // typed array Int32Array etc.
  if (
    typeof obj.subarray === "function" &&
    /[A-Z][A-Za-z\d]+Array/.test(Object.prototype.toString.call(obj))
  ) {
    return obj.subarray(0);
  }

  if (!refs) refs = [];
  if (!circularValue) circularValue = "[Circular]";

  refs[refs.length] = obj;

  if (isArrayLike(obj)) {
    const copy: any = Array.from(obj);

    for (let i = 0; i < copy.length; i++) {
      let v = copy[i];

      if (~refs.indexOf(v)) {
        v = circularValue;
      }

      if (v === undefined || v === skipValue) {
        v = null;
      }

      copy[i] = clone(v, circularValue, refs);
    }

    refs.length && refs.length--;
    return copy;
  }

  let copy: any = {};

  if (obj instanceof Error) {
    copy.name = obj.name;
    copy.message = obj.message;
    copy.stack = obj.stack;
  }

  let keys = Object.keys(obj);
  let l = keys.length;

  while (l--) {
    let k = keys[l];
    const v = ~refs.indexOf(obj[k])
      ? circularValue
      : clone(obj[k], circularValue, refs);
    if (v !== undefined && v !== skipValue) {
      copy[k] = v;
    }
  }

  refs.length && refs.length--;
  return copy;
}
