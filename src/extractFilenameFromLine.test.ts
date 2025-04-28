import { strict as assert } from "assert";
import { extractFilenameFromLine } from "./extractFilenameFromLine.js";
import { describe, it } from "node:test";

describe("extractFilenameFromLine", () => {
  it("should return an unquoted file path if it is valid", () => {
    const result = extractFilenameFromLine("/path/to/file.js");
    assert.strictEqual(result, "/path/to/file.js");
  });

  it("should return the first quoted file path if found", () => {
    const result = extractFilenameFromLine(
      'This is a test "/path/to/file.js" for extraction.'
    );
    assert.strictEqual(result, "/path/to/file.js");
  });

  it("should return undefined if no valid file path is found", () => {
    const result = extractFilenameFromLine("No file path here!");
    assert.strictEqual(result, undefined);
  });

  it("should handle multiple quoted paths and return the first valid one", () => {
    const result = extractFilenameFromLine(
      'Here is a test: "/@invalid/path." and then this one "/path/to/file.js".'
    );
    assert.strictEqual(result, "/path/to/file.js");
  });

  it("should return a file path wrapped in single quotes", () => {
    const result = extractFilenameFromLine(
      "Here is a test with a single quoted file path: '/path/to/file.js'"
    );
    assert.strictEqual(result, "/path/to/file.js");
  });

  it("should return a file path wrapped in backticks", () => {
    const result = extractFilenameFromLine(
      "Using a backtick: `/path/to/file.js`."
    );
    assert.strictEqual(result, "/path/to/file.js");
  });

  it("should return a file path unquoted in a bash comment", () => {
    assert.strictEqual(
      extractFilenameFromLine("# /path/to/file.js"),
      "/path/to/file.js"
    );
    assert.strictEqual(
      extractFilenameFromLine("# path/to/file.js"),
      "path/to/file.js"
    );
  });

  it("should return a file path unquoted in a c comment", () => {
    assert.strictEqual(
      extractFilenameFromLine("// /path/to/file.js"),
      "/path/to/file.js"
    );
    assert.strictEqual(
      extractFilenameFromLine("// path/to/file.js"),
      "path/to/file.js"
    );
  });

  it("should handle an empty line", () => {
    const result = extractFilenameFromLine("");
    assert.strictEqual(result, undefined);
  });

  it("should return a relative path in quoted strings", () => {
    const result = extractFilenameFromLine(
      'A quoted text "file/path.txt" that is valid.'
    );
    assert.strictEqual(result, "file/path.txt");
  });

  it("should handle a path surrounded by symbols", () => {
    const result = extractFilenameFromLine("### a/file/path.txt");
    assert.strictEqual(result, "a/file/path.txt");
  });

  it("should handle a path surrounded by symbols 2", () => {
    const result = extractFilenameFromLine("##### a/file/path.txt ###");
    assert.strictEqual(result, "a/file/path.txt");
  });

  it("should return the first valid unquoted file path from a sentence", () => {
    const result = extractFilenameFromLine(
      "This is an example path: /valid/path/file.txt."
    );
    assert.strictEqual(result, "/valid/path/file.txt");
  });

  it("should return the correct unquoted path ignoring invalid paths", () => {
    const result = extractFilenameFromLine(
      "Invalid path here: /invalid/path? then a valid one: /another/valid/path.txt"
    );
    assert.strictEqual(result, "/another/valid/path.txt");
  });

  it("should handle .env", () => {
    assert.strictEqual(extractFilenameFromLine(".env"), ".env");
    assert.strictEqual(extractFilenameFromLine("# .env"), ".env");
    assert.strictEqual(extractFilenameFromLine("// .env"), ".env");
    assert.strictEqual(extractFilenameFromLine("Path: `.env`"), ".env");
    assert.strictEqual(extractFilenameFromLine('Path: ".env"'), ".env");
    assert.strictEqual(extractFilenameFromLine("Path: '.env'"), ".env");
    assert.strictEqual(
      extractFilenameFromLine("Some text .env more text"),
      ".env"
    );
  });

  it("should handle ./.env", () => {
    assert.strictEqual(extractFilenameFromLine("./.env"), "./.env");
    assert.strictEqual(extractFilenameFromLine("# ./.env"), "./.env");
    assert.strictEqual(extractFilenameFromLine("// ./.env"), "./.env");
    assert.strictEqual(extractFilenameFromLine("Path: `./.env`"), "./.env");
    assert.strictEqual(
      extractFilenameFromLine("Some text ./.env more text"),
      "./.env"
    );
  });

  it("should handle a/b/c/.env.local", () => {
    assert.strictEqual(
      extractFilenameFromLine("a/b/c/.env.local"),
      "a/b/c/.env.local"
    );
    assert.strictEqual(
      extractFilenameFromLine("# a/b/c/.env.local"),
      "a/b/c/.env.local"
    );
    assert.strictEqual(
      extractFilenameFromLine("// a/b/c/.env.local"),
      "a/b/c/.env.local"
    );
    assert.strictEqual(
      extractFilenameFromLine("Path: `a/b/c/.env.local`"),
      "a/b/c/.env.local"
    );
    assert.strictEqual(
      extractFilenameFromLine("Some text a/b/c/.env.local more text"),
      "a/b/c/.env.local"
    );
  });

  it("should handle (config)/layout.tsx", () => {
    assert.strictEqual(
      extractFilenameFromLine("(config)/layout.tsx"),
      "(config)/layout.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("# (config)/layout.tsx"),
      "(config)/layout.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("// (config)/layout.tsx"),
      "(config)/layout.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("Path: `(config)/layout.tsx`"),
      "(config)/layout.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("Some text (config)/layout.tsx more text"),
      "(config)/layout.tsx"
    );
  });

  it("should handle src/(auth)/login/page.tsx", () => {
    assert.strictEqual(
      extractFilenameFromLine("src/(auth)/login/page.tsx"),
      "src/(auth)/login/page.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("# src/(auth)/login/page.tsx"),
      "src/(auth)/login/page.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("// src/(auth)/login/page.tsx"),
      "src/(auth)/login/page.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("Path: `src/(auth)/login/page.tsx`"),
      "src/(auth)/login/page.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("Some text src/(auth)/login/page.tsx more text"),
      "src/(auth)/login/page.tsx"
    );
  });

  it("should handle path with spaces", () => {
    assert.strictEqual(
      extractFilenameFromLine("// `path/with spaces/file.txt`"),
      "path/with spaces/file.txt"
    );
    assert.strictEqual(
      extractFilenameFromLine("# `path/with spaces/file.txt`"),
      "path/with spaces/file.txt"
    );
    assert.strictEqual(
      extractFilenameFromLine("Path: `path/with spaces/file.txt`"),
      "path/with spaces/file.txt"
    );
  });

  it("should handle my.file.name.txt", () => {
    assert.strictEqual(
      extractFilenameFromLine("my.file.name.txt"),
      "my.file.name.txt"
    );
    assert.strictEqual(
      extractFilenameFromLine("# my.file.name.txt"),
      "my.file.name.txt"
    );
    assert.strictEqual(
      extractFilenameFromLine("// my.file.name.txt"),
      "my.file.name.txt"
    );
    assert.strictEqual(
      extractFilenameFromLine("Path: `my.file.name.txt`"),
      "my.file.name.txt"
    );
    assert.strictEqual(
      extractFilenameFromLine("Some text my.file.name.txt more text"),
      "my.file.name.txt"
    );
  });

  it("should prioritize quoted paths over unquoted paths in the same line", () => {
    assert.strictEqual(
      extractFilenameFromLine("invalid/path? `valid/path.txt`"),
      "valid/path.txt"
    );
    assert.strictEqual(
      extractFilenameFromLine("valid/path1.txt `valid/path2.txt`"),
      "valid/path2.txt"
    );
  });

  it("should handle paths with mixed characters including dots, hyphens, underscores, and slashes", () => {
    assert.strictEqual(
      extractFilenameFromLine("my-file_name.1.0/path/to/file.txt"),
      "my-file_name.1.0/path/to/file.txt"
    );
  });

  it("should handle paths with mixed characters including dots, hyphens, underscores, slashes, and parentheses", () => {
    assert.strictEqual(
      extractFilenameFromLine("my-file_name.1.0/path/(group)/file.txt"),
      "my-file_name.1.0/path/(group)/file.txt"
    );
  });

  it("should handle paths starting with a dot and containing parentheses", () => {
    assert.strictEqual(
      extractFilenameFromLine(".next/(cache)/route.js"),
      ".next/(cache)/route.js"
    );
  });

  it("should handle paths with square brackets", () => {
    assert.strictEqual(
      extractFilenameFromLine("app/[locale]/page.tsx"),
      "app/[locale]/page.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("# app/[locale]/page.tsx"),
      "app/[locale]/page.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("// app/[locale]/page.tsx"),
      "app/[locale]/page.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("Path: `app/[locale]/page.tsx`"),
      "app/[locale]/page.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("Some text app/[locale]/page.tsx more text"),
      "app/[locale]/page.tsx"
    );
  });

  it("should handle paths with square brackets and spread syntax", () => {
    assert.strictEqual(
      extractFilenameFromLine("app/(marketing)/[...slug]/page.tsx"),
      "app/(marketing)/[...slug]/page.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("# app/(marketing)/[...slug]/page.tsx"),
      "app/(marketing)/[...slug]/page.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("// app/(marketing)/[...slug]/page.tsx"),
      "app/(marketing)/[...slug]/page.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine("Path: `app/(marketing)/[...slug]/page.tsx`"),
      "app/(marketing)/[...slug]/page.tsx"
    );
    assert.strictEqual(
      extractFilenameFromLine(
        "Some text app/(marketing)/[...slug]/page.tsx more text"
      ),
      "app/(marketing)/[...slug]/page.tsx"
    );
  });
});
