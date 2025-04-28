import { strict as assert } from "assert";
import { describe, it } from "node:test";
import { extractCommentString } from "./extractCommentString.js";

describe("extractCommentString", () => {
  describe("JavaScript/CSS/Java-like multiline /* ... */", () => {
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

    it("trims spaces and extracts comment with trailing spaces", () => {
      assert.equal(
        extractCommentString("   /* trailingSpaceFile.css */   "),
        "trailingSpaceFile.css"
      );
    });

    it("extracts comment with ./ prefix from multiline comment", () => {
      assert.equal(
        extractCommentString("/* ./path/to/file.ext */"),
        "./path/to/file.ext"
      );
    });

    it("extracts comment within backticks from multiline comment", () => {
      assert.equal(
        extractCommentString("/* `path with spaces/file.txt` */"),
        "`path with spaces/file.txt`"
      );
    });
  });

  describe("JavaScript/C++/Java-like single-line // ...", () => {
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

    it("trims spaces and extracts comment with leading spaces", () => {
      assert.equal(
        extractCommentString("   // leadingSpaceFile.js  "),
        "leadingSpaceFile.js"
      );
    });

    it("extracts comment with ./ prefix from single-line comment", () => {
      assert.equal(
        extractCommentString("// ./path/to/file.ext"),
        "./path/to/file.ext"
      );
    });

    it("extracts comment within backticks from single-line comment", () => {
      assert.equal(
        extractCommentString("// `path with spaces/file.txt`"),
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

  describe("Shell/Bash single-line # ...", () => {
    it("extracts comment from shell/bash single-line comment (#)", () => {
      assert.equal(
        extractCommentString("# myShellScript.sh"),
        "myShellScript.sh"
      );
    });

    it("extracts comment from shell/bash single-line comment at end of line", () => {
      assert.equal(
        extractCommentString("echo 'hello' # anotherScript.bash"),
        "anotherScript.bash"
      );
    });

    it("trims spaces from shell/bash single-line comment", () => {
      assert.equal(
        extractCommentString("  # spacedShell.sh  "),
        "spacedShell.sh"
      );
    });

    it("extracts comment with ./ prefix from shell/bash comment", () => {
      assert.equal(
        extractCommentString("# ./scripts/setup.sh"),
        "./scripts/setup.sh"
      );
    });
  });

  describe("HTML multiline <!-- ... -->", () => {
    it("extracts comment from HTML multiline comment (<!-- -->)", () => {
      assert.equal(
        extractCommentString("<!-- myHtmlFile.html -->"),
        "myHtmlFile.html"
      );
    });

    it("extracts comment from HTML multiline comment with content around", () => {
      assert.equal(
        extractCommentString("<div> <!-- anotherHtml.html --> </div>"),
        "anotherHtml.html"
      );
    });

    it("extracts comment from HTML multiline comment with newlines inside", () => {
      assert.equal(
        extractCommentString("<!--\nmulti\nline\nhtml.html\n-->"),
        "multi\nline\nhtml.html"
      );
    });

    it("trims spaces from HTML multiline comment", () => {
      assert.equal(
        extractCommentString("  <!-- spacedHtml.html -->  "),
        "spacedHtml.html"
      );
    });

    it("extracts comment with ./ prefix from HTML comment", () => {
      assert.equal(
        extractCommentString("<!-- ./templates/index.html -->"),
        "./templates/index.html"
      );
    });
  });

  describe("Lua single-line -- ...", () => {
    it("extracts comment from Lua single-line comment (--)", () => {
      assert.equal(extractCommentString("-- myLuaFile.lua"), "myLuaFile.lua");
    });

    it("extracts comment from Lua single-line comment at end of line", () => {
      assert.equal(
        extractCommentString("local x = 1 -- anotherLua.lua"),
        "anotherLua.lua"
      );
    });

    it("trims spaces from Lua single-line comment", () => {
      assert.equal(
        extractCommentString("  -- spacedLua.lua  "),
        "spacedLua.lua"
      );
    });

    it("extracts comment with ./ prefix from Lua comment", () => {
      assert.equal(
        extractCommentString("-- ./modules/utils.lua"),
        "./modules/utils.lua"
      );
    });
  });

  describe("Batch single-line rem/:: ...", () => {
    it("extracts comment from Batch single-line comment (rem)", () => {
      assert.equal(
        extractCommentString("rem myBatchFile.bat"),
        "myBatchFile.bat"
      );
    });

    it("extracts comment from Batch single-line comment (REM)", () => {
      assert.equal(
        extractCommentString("REM myBatchFile.bat"),
        "myBatchFile.bat"
      );
    });

    it("extracts comment from Batch single-line comment (::)", () => {
      assert.equal(
        extractCommentString(":: anotherBatch.cmd"),
        "anotherBatch.cmd"
      );
    });

    it("extracts comment from Batch single-line comment (rem) at end of line", () => {
      assert.equal(
        extractCommentString("echo hello\nrem endOfLine.bat"),
        "endOfLine.bat"
      );
    });

    it("extracts comment from Batch single-line comment (::) at end of line", () => {
      assert.equal(
        extractCommentString("echo hello\n:: endOfLine.cmd"),
        "endOfLine.cmd"
      );
    });

    it("trims spaces from Batch single-line comment (rem)", () => {
      assert.equal(
        extractCommentString("  rem spacedBatch.bat  "),
        "spacedBatch.bat"
      );
    });

    it("trims spaces from Batch single-line comment (::)", () => {
      assert.equal(
        extractCommentString("  :: spacedBatch.cmd  "),
        "spacedBatch.cmd"
      );
    });

    it("extracts comment with ./ prefix from Batch comment (rem)", () => {
      assert.equal(
        extractCommentString("rem ./scripts/run.bat"),
        "./scripts/run.bat"
      );
    });

    it("extracts comment with ./ prefix from Batch comment (::)", () => {
      assert.equal(
        extractCommentString(":: ./scripts/run.cmd"),
        "./scripts/run.cmd"
      );
    });
  });

  describe("General cases (no comment, empty, mixed, trimming)", () => {
    it("extracts first comment type when both types are present on the same line (multiline first)", () => {
      assert.equal(
        extractCommentString("/* file1.css */ some text // file2.js"),
        "file1.css"
      );
    });

    it("extracts first single-line comment when both types are present on different lines", () => {
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

    it("returns undefined for empty string input", () => {
      assert.equal(extractCommentString(""), undefined);
    });
  });
});
