import { isArrayLike } from "./is-array-like.ts";

/**
 * Will create a cloned copy of the input object.
 *
 * @param input Object to Clone
 * @param refs Circular reference lookup table (optional)
 * @returns Clone of original input.
 */
export function clone<T>(input: T, refs?: T[]): T {
  const obj: any = input;
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

  if (isArrayLike(obj)) {
    const ret: any = Array.from(obj);
    return ret;
  }

  refs[refs.length] = obj;
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
    copy[k] = ~refs.indexOf(obj[k]) ? "[Circular]" : clone(obj[k], refs);
  }

  refs.length && refs.length--;
  return copy;
}
