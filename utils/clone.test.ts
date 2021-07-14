import {
  assert,
  assertArrayIncludes,
  assertEquals,
  assertNotEquals,
  assertNotStrictEquals,
  assertObjectMatch,
  assertStrictEquals,
} from "https://deno​.land/std@0.101.0/testing/asserts.ts";

import { clone } from "./clone.ts";

const getComplexInput = (): any => {
  var a: any = {};
  a.a = a;
  a.b = {};
  a.b.a = a;
  a.b.b = a.b;
  a.c = {};
  a.c.b = a.b;
  a.c.c = a.c;
  a.x = 1;
  a.b.x = 2;
  a.c.x = 3;
  a.d = [0, a, 1, a.b, 2, a.c, 3];
  return a;
};

Deno.test({
  name: "[utils/clone] - Will clone a string",
  fn: () => {
    var i = "";
    var o = clone(i);
    assertEquals(i, o);
  },
});

Deno.test({
  name: "[utils/clone] - Will clone an object",
  fn: () => {
    var i = { foo: "bar", bar: "foo" };
    var o = clone(i);
    assertNotStrictEquals(o, i);
    assertObjectMatch(o, i);
  },
});

Deno.test({
  name: "[utils/clone] - Will clone a Date",
  fn: () => {
    const a = new Date();
    const b = clone(a);
    assertNotStrictEquals(a, b);
    assertEquals(a.valueOf(), b.valueOf());
  },
});

Deno.test({
  name: "[utils/clone] - Will clone a typed array (UInt8Array)",
  fn: () => {
    const a = "This is a test. 😁";
    const b = new TextEncoder().encode(a);
    const c = clone(b);
    const d = new TextDecoder().decode(c);
    assertEquals(a, d);
  },
});

Deno.test({
  name: "[utils/clone] - Will clone Array-like",
  fn: () => {
    var t = { length: 3, 0: "test", 1: "test", 2: "test" };
    var o: any = clone(t);
    assert(o instanceof Array);
    assertEquals(o, ["test", "test", "test"], JSON.stringify(o));
  },
});

Deno.test({
  name: "[utils/clone] - Will clone error properties",
  fn: () => {
    const a = new Error("this is a test");
    const b = clone(a);
    assertNotEquals(b, a);
    assertObjectMatch(b, {
      name: a.name,
      stack: a.stack,
      message: a.message,
    });
  },
});

Deno.test({
  name: "[utils/clone] - Skips inherited properties",
  fn: () => {
    class Base {
      base = true;
    }
    class Child extends Base {
      child = true;
    }

    var z = clone(new Child());
    assert(z.base, undefined);
    assertEquals(z.child, true);
  },
});

Deno.test({
  name: "[utils/clone] - Skips circular data",
  fn: () => {
    const input: any = getComplexInput();
    const output: any = clone(input);

    assertEquals(output.a, "[Circular]");
    assertEquals(output.b.a, "[Circular]");
    assertEquals(output.b.b, "[Circular]");
    assertEquals(output.b.x, 2);
    assertEquals(output.x, 1);
    assertStrictEquals(output.c.a, undefined);
    assertObjectMatch(output.c.b, { a: "[Circular]", b: "[Circular]", x: 2 });
    assertEquals(output.c.c, "[Circular]");
    assertEquals(output.c.x, 3);
  },
});
