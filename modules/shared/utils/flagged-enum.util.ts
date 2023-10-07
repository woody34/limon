import { assertEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";

export function enumHasFlag(allowedFlags: number[], input: number): boolean {
  return allowedFlags.some((f) => f === (f & input));
}
Deno.test("enumHasFlag", async (ctx) => {
  enum Roles {
    None = 0,
    General = 1 << 0,
    Read = 1 << 1,
    Write = 1 << 2,
    Special = 1 << 3,
    ReadWrite = Read | Write,
    Root = ~(~0 << 4),
  }

  await ctx.step("should only have assigned flag", () => {
    const input = Roles.None;
    assertEquals(enumHasFlag([Roles.Read], input), false);
    assertEquals(enumHasFlag([Roles.None], input), true);
  });

  await ctx.step("should have intersection of flag", () => {
    const input = Roles.Read | Roles.Write;
    assertEquals(enumHasFlag([Roles.Read], input), true);
    assertEquals(enumHasFlag([Roles.Write], input), true);
    assertEquals(enumHasFlag([Roles.ReadWrite], input), true);
    assertEquals(enumHasFlag([Roles.Special], input), false);
  });

  await ctx.step("should have all flags as root", () => {
    const input = Roles.Root;
    assertEquals(enumHasFlag([Roles.Read], input), true);
    assertEquals(enumHasFlag([Roles.Write], input), true);
    assertEquals(enumHasFlag([Roles.ReadWrite], input), true);
    assertEquals(enumHasFlag([Roles.Special], input), true);
  });
});

export function mergeEnumFlags(...flags: number[]): number {
  return flags.reduce((acc, flag) => {
    return acc |= flag;
  }, 0);
}
Deno.test("mergeEnumFlags", async (ctx) => {
  enum Roles {
    None = 0,
    General = 1 << 0,
    Read = 1 << 1,
    Write = 1 << 2,
    Special = 1 << 3,
    ReadWrite = Read | Write,
    Root = ~(~0 << 4),
  }

  await ctx.step("should merge flags", () => {
    const input = Roles.None | Roles.General;
    const result = mergeEnumFlags(input, Roles.ReadWrite);
    assertEquals(result, Roles.None | Roles.General | Roles.ReadWrite);
    assertEquals(enumHasFlag([Roles.General, Roles.ReadWrite], result), true);
    assertEquals(enumHasFlag([Roles.General, Roles.ReadWrite], result), true);
    assertEquals(enumHasFlag([Roles.Root], result), false);
    assertEquals(enumHasFlag([Roles.Special], result), false);
  });
});

export function toggleEnumFlag(input: number, remove: number): number {
  return input ^= remove;
}
Deno.test("toggleEnumFlag", async (ctx) => {
  enum Roles {
    None = 0,
    General = 1 << 0,
    Read = 1 << 1,
    Write = 1 << 2,
    Special = 1 << 3,
    Root = ~(~0 << 4),
  }

  await ctx.step("should toggle flags", () => {
    const input = Roles.Read | Roles.Write;

    const result = toggleEnumFlag(input, Roles.Write);

    assertEquals(result, Roles.Read);
    assertEquals(enumHasFlag([Roles.Write], result), false);
    assertEquals(enumHasFlag([Roles.Read], result), true);
  });

  await ctx.step("should double toggle flags", () => {
    const input = Roles.Write;
    const result = toggleEnumFlag(input, Roles.Write);
    assertEquals(result, Roles.None);
  });
});
