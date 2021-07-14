import {
  assert,
  assertArrayIncludes,
  assertEquals,
  assertNotEquals,
  assertNotStrictEquals,
  assertObjectMatch,
  assertStrictEquals,
} from "https://deno​.land/std@0.101.0/testing/asserts.ts";

import { deepMerge, sortObject } from "./deep-merge.ts";

Deno.test({
  name: "[utils/deep-merge] - will deep merge objects",
  fn: () => {
    const base = {
      a: 1,
      b: {
        c: 2,
        d: 3,
      },
    };
    const nest = { b: { d: 4, e: 5 } };
    const expected = {
      a: 1,
      b: {
        c: 2,
        d: 4,
        e: 5,
      },
    };

    assertObjectMatch(deepMerge(base, nest), expected);
  },
});

Deno.test({
  name: "[utils/deep-merge] - will return undefined for null override",
  fn: () => {
    assertStrictEquals(deepMerge(0, null), undefined);
  },
});

Deno.test({
  name: "[utils/deep-merge] - will return a when b is undefined",
  fn: () => {
    assertStrictEquals(deepMerge(0, undefined), 0);
  },
});

Deno.test({
  name: "[utils/deep-merge] - will return b when not an object",
  fn: () => {
    assertStrictEquals(deepMerge({}, 1), 1);
  },
});

Deno.test({
  name: "[utils/deep-merge] - will return clonded Date, when b is a Date",
  fn: () => {
    const b = new Date();
    const r = deepMerge({}, b);
    assertNotStrictEquals(b, r);
    assertEquals(b, r);
  },
});

Deno.test({
  name: "[utils/deep-merge] - will return b when a is simple",
  fn: () => {
    const b = { a: 1, b: { c: 2 } };
    const r = deepMerge(0, b);
    assertNotStrictEquals(b, r);
    assertEquals(r, b);
  },
});

Deno.test({
  name: "[utils/deep-merge] - will return b when a is an array",
  fn: () => {
    const b = { a: 1, b: { c: 2 } };
    assertEquals(deepMerge([], b), b);
  },
});

Deno.test({
  name: "[utils/deep-merge] - will return b when a is a Date",
  fn: () => {
    const b = { a: 1, b: { c: 2 } };
    const r = deepMerge(new Date(), b);
    assertNotStrictEquals(b, r);
    assertEquals(r, b);
  },
});

Deno.test({
  name: "[utils/deep-merge] - override arrays",
  fn: () => {
    const a = [1, 2, 3];
    const b = [4, 5, 6];
    const r = deepMerge(a, b);
    assertEquals(r, b);
    assertNotStrictEquals(r, b);
  },
});

Deno.test({
  name: "[utils/deep-merge] - will clear null overrides",
  fn: () => {
    const a = { a: { b: {} } };
    const b = { a: { b: null } };
    const exp = { a: {} };
    const r = deepMerge(a, b);
    assertEquals(r, exp);
    assertNotStrictEquals(r, exp);
  },
});

Deno.test({
  name:
    "[utils/deep-merge] - will replace an object when __REPLACE__ is set and truthy",
  fn: () => {
    const a = { a: 1, b: { c: 1 } };
    const b = { c: 1, b: { __REPLACE__: true, d: 2 } };
    const exp = { a: 1, c: 1, b: { d: 2 } };
    const r = deepMerge(a, b);
    assertEquals(r, exp);
    assertNotStrictEquals(r, exp);
  },
});

Deno.test({
  name: "[utils/deep-merge] - sortObject will return primatives as-is",
  fn: () => {
    assertStrictEquals(sortObject(0), 0);
  },
});

Deno.test({
  name: "[utils/deep-merge] - sortObject will map arrays",
  fn: () => {
    const a = {
      length: 1,
      map: () => 1234,
    };
    assertStrictEquals(sortObject(a), 1234);
  },
});

Deno.test({
  name: "[utils/deep-merge] - sortObject will clone dates",
  fn: () => {
    const d1 = new Date();
    const d2 = sortObject(d1);
    assertEquals(d1, d2);
    assertNotStrictEquals(d1, d2);
  },
});
