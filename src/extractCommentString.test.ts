import { strict as assert } from "assert";
import { describe, it } from "node:test";
import { extractCommentString } from "./extractCommentString.js";

describe("extractCommentString", () => {
  it("extracts comment from multiline comment", () => {
    assert.equal(extractCommentString("/* myFile.css */"), "myFile.css");
  });

  it("extracts comment from multiline comment followed by text", () => {
    assert.equal(
      extractCommentString("/* anotherFile.js */ some random text"),
      "anotherFile.js"
    );
  });

  it("extracts comment from multiline comment preceded by code", () => {
    assert.equal(
      extractCommentString("Some code here \n/* lastFile.html */"),
      "lastFile.html"
    );
  });

  it("extracts comment from single-line comment", () => {
    assert.equal(
      extractCommentString("// mySingleLineFile.js"),
      "mySingleLineFile.js"
    );
  });

  it("extracts comment from single-line comment at the end of code", () => {
    assert.equal(
      extractCommentString("const a = 10; // testFile.txt"),
      "testFile.txt"
    );
  });

  it("extracts first comment type when both types are present on the same line (multiline first)", () => {
    assert.equal(
      extractCommentString("/* file1.css */ some text // file2.js"),
      "file1.css"
    );
  });

  it.skip("extracts first single-line comment when both types are present on different lines", () => {
    assert.equal(
      extractCommentString("// file3.js\n/* file4.css */"),
      "file3.js"
    );
  });

  it("returns undefined when there are no comments", () => {
    assert.equal(
      extractCommentString("This is just some code without comments."),
      undefined
    );
  });

  it("trims spaces and extracts comment with leading spaces", () => {
    assert.equal(
      extractCommentString("   // leadingSpaceFile.js  "),
      "leadingSpaceFile.js"
    );
  });

  it("trims spaces and extracts comment with trailing spaces", () => {
    assert.equal(
      extractCommentString("   /* trailingSpaceFile.css */   "),
      "trailingSpaceFile.css"
    );
  });

  it("returns undefined for empty string input", () => {
    assert.equal(extractCommentString(""), undefined);
  });

  it("extracts comment with ./ prefix from single-line comment", () => {
    assert.equal(
      extractCommentString("// ./path/to/file.ext"),
      "./path/to/file.ext"
    );
  });

  it("extracts comment with ./ prefix from multiline comment", () => {
    assert.equal(
      extractCommentString("/* ./path/to/file.ext */"),
      "./path/to/file.ext"
    );
  });

  it("extracts comment within backticks from single-line comment", () => {
    assert.equal(
      extractCommentString("// `path with spaces/file.txt`"),
      "`path with spaces/file.txt`"
    );
  });

  it("extracts comment within backticks from multiline comment", () => {
    assert.equal(
      extractCommentString("/* `path with spaces/file.txt` */"),
      "`path with spaces/file.txt`"
    );
  });

  it("extracts comment within backticks with special characters", () => {
    assert.equal(
      extractCommentString("// `app/[locale]/[...slug]/page.tsx`"),
      "`app/[locale]/[...slug]/page.tsx`"
    );
  });

  it("extracts comment within backticks with leading/trailing spaces inside", () => {
    assert.equal(
      extractCommentString("// `  path with spaces  `"),
      "`  path with spaces  `"
    );
  });

  it("extracts comment within backticks with leading/trailing spaces outside", () => {
    assert.equal(
      extractCommentString("  // `path with spaces`  "),
      "`path with spaces`"
    );
  });

  it("extracts comment within backticks even if non-backtick format is also present (backtick first)", () => {
    assert.equal(
      extractCommentString("// `file with spaces` // otherfile"),
      "`file with spaces` // otherfile"
    );
  });

  it("extracts comment within backticks even if non-backtick format is also present (non-backtick first)", () => {
    assert.equal(
      extractCommentString("// otherfile // `file with spaces`"),
      "otherfile // `file with spaces`"
    );
  });

  it("extracts comment with ./ prefix and backticks from single-line comment", () => {
    assert.equal(
      extractCommentString("// `./path/to/file.ext`"),
      "`./path/to/file.ext`"
    );
  });
});
