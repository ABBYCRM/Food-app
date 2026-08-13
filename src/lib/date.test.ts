import { describe, expect, it } from "vitest";
import { localDateKey } from "./date";

describe("local planner dates", () => {
  it("formats the calendar date without converting through UTC", () => {
    const local = new Date(2026, 7, 3, 0, 5, 0);
    expect(localDateKey(local)).toBe("2026-08-03");
  });
});
