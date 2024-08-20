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
});
