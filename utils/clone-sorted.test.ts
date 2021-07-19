import {
  assertEquals,
  assertNotStrictEquals,
  assertObjectMatch,
  assertStrictEquals,
} from "https://deno​.land/std@0.101.0/testing/asserts.ts";

import { cloneSorted } from "./clone-sorted.ts";

Deno.test({
  name: "[utils/clone-sorted] - cloneSorted will return primatives as-is",
  fn: () => {
    assertStrictEquals(cloneSorted(0), 0);
  },
});

Deno.test({
  name: "[utils/clone-sorted] - cloneSorted will map arrays",
  fn: () => {
    const a = {
      length: 1,
      map: () => 1234,
    };
    assertStrictEquals(cloneSorted(a), 1234);
  },
});

Deno.test({
  name: "[utils/clone-sorted] - cloneSorted will clone dates",
  fn: () => {
    const d1 = new Date();
    const d2 = cloneSorted(d1);
    assertEquals(d1, d2);
    assertNotStrictEquals(d1, d2);
  },
});

Deno.test({
  name: "[utils/clone-sorted] - cloned object keys in sorted order",
  fn: () => {
    const r = cloneSorted({ z: true, b: true, c: true });
    assertEquals(Object.keys(r), ["b", "c", "z"]);
  },
});
