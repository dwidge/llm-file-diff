import { describe, test } from "node:test";
import { expect } from "expect";
import { isFilePath } from "./isFilePath.js";

describe("isFilePath", () => {
  test("emptyString", () => {
    expect(isFilePath("")).toBe(false);
  });

  test("valid", () => {
    expect(isFilePath("C:\\path\\to\\file.txt")).toBe(true);
    expect(isFilePath("/path/to/file.txt")).toBe(true);
    expect(isFilePath("D:\\Documents\\file.doc")).toBe(true);
    expect(isFilePath("/usr/local/bin/script.sh")).toBe(true);
  });

  test("relative", () => {
    expect(isFilePath("relative/path/file.txt")).toBe(true);
    expect(isFilePath("..\\relative\\path\\file.txt")).toBe(true);
  });

  test("withoutExtension", () => {
    expect(isFilePath("C:\\path\\to\\file")).toBe(false);
    expect(isFilePath("/path/to/file")).toBe(false);
  });

  test.skip("invalidCharacters", () => {
    expect(isFilePath("C:\\path\\to\\@invalid~file.txt")).toBe(false);
  });

  test.skip("invalidDrive", () => {
    expect(isFilePath("C:wrong\\path\\file.txt")).toBe(false);
  });

  test("invalidExtension", () => {
    expect(isFilePath("C:\\path\\to\\file.")).toBe(false);
    expect(isFilePath("path/to/file.txt/invalidextension")).toBe(false);
  });
});
