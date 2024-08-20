import { strict as assert } from "assert";
import { describe, it } from "node:test";
import { extractCommentString } from "./extractCommentString.js";

describe("extractCommentString", () => {
  // Test cases for multiline comments
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

  // Test cases for single-line comments
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

  // Test with both comment types
  it("extracts first comment type when both types are present", () => {
    assert.equal(
      extractCommentString("/* file1.css */ some text // file2.js"),
      "file1.css"
    );
  });

  it.skip("extracts first single-line comment when both types are present", () => {
    assert.equal(
      extractCommentString("// file3.js\n/* file4.css */"),
      "file3.js"
    );
  });

  // Test no comments
  it("returns undefined when there are no comments", () => {
    assert.equal(
      extractCommentString("This is just some code without comments."),
      undefined
    );
  });

  // Test with leading/trailing spaces
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

  // Test with empty string
  it("returns undefined for empty string input", () => {
    assert.equal(extractCommentString(""), undefined);
  });
});
