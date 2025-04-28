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
    expect(isFilePath("C:\\path\\to\\valid~file.txt")).toBe(true);
    expect(isFilePath("C:\\path\\to\\valid@file.txt")).toBe(true);
  });

  test("relative", () => {
    expect(isFilePath("relative/path/file.txt")).toBe(true);
    expect(isFilePath("..\\relative\\path\\file.txt")).toBe(true);
    expect(isFilePath("./path/to/file.ext")).toBe(true);
  });

  test("hidden", () => {
    expect(isFilePath(".env")).toBe(true);
    expect(isFilePath("./.env")).toBe(true);
    expect(isFilePath(".gitignore")).toBe(true);
    expect(isFilePath("/home/user/.bashrc")).toBe(true);
    expect(isFilePath("path/to/.hiddenfile.txt")).toBe(true);
    expect(isFilePath(".next/route.js")).toBe(true);
  });

  test("specialCharacters", () => {
    expect(isFilePath("./src/(auth)/login/page.tsx")).toBe(true);
    expect(isFilePath("(group)/file.txt")).toBe(true);
    expect(isFilePath("path/(group)/file.txt")).toBe(true);
    expect(isFilePath("[id].tsx")).toBe(true);
    expect(isFilePath("path/[id].tsx")).toBe(true);
    expect(isFilePath(".next/(cache)/route.js")).toBe(true);
    expect(isFilePath("app/[locale]/page.tsx")).toBe(true);
  });

  test("spreadSyntax", () => {
    expect(isFilePath("app/(marketing)/[...slug]/page.tsx")).toBe(true);
    expect(isFilePath("app/[...catchall]/page.tsx")).toBe(true);
    expect(isFilePath("app/path/[...slug].js")).toBe(true);
    expect(isFilePath("app/[...rest]/route.ts")).toBe(true);
    expect(isFilePath("app/[[...optional]]/page.tsx")).toBe(true);
  });

  test("withoutExtension", () => {
    expect(isFilePath("C:\\path\\to\\file")).toBe(false);
    expect(isFilePath("/path/to/file")).toBe(false);
  });

  test("invalidCharacters", () => {
    expect(isFilePath("C:\\path\\to\\invalid|file.txt")).toBe(false);
    expect(isFilePath("C:\\path\\to\\invalid<file.txt")).toBe(false);
    expect(isFilePath("C:\\path\\to\\invalid>file.txt")).toBe(false);
    expect(isFilePath("file*name.txt")).toBe(false);
    expect(isFilePath("file?name.txt")).toBe(false);
  });

  test("invalidDrive", () => {
    expect(isFilePath("C:wrong\\path\\file.txt")).toBe(false);
  });

  test("invalidExtension", () => {
    expect(isFilePath("C:\\path\\to\\file.")).toBe(false);
    expect(isFilePath("path/to/file.txt/invalidextension")).toBe(false);
  });

  test("invalidQuotes", () => {
    expect(isFilePath("file path: '/path/to/file.js")).toBe(false);
  });

  test("invalidExamplePath", () => {
    expect(isFilePath("This is an example path: /valid/path/file.txt")).toBe(
      false
    );
  });
});
