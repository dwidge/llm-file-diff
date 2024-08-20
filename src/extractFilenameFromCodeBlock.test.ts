import { strict as assert } from "assert";
import { describe, it } from "node:test";
import { extractFilenameFromCodeBlock } from "./extractFilenameFromCodeBlock.js";

describe("extractFilenameFromCodeBlock", () => {
  it("cssWithFileComment", () => {
    const response = `
/* subdir2/file5.css */
body { background-color: white; }
`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "subdir2/file5.css");
  });

  it("cssWithFileMarkdown", () => {
    const response = `
/* \`subdir2/file5.css\` */
body { background-color: white; }
`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "subdir2/file5.css");
  });

  it("javascriptWithFileComment", () => {
    const response = `
// subdir2/file5.js
const x = 1;
`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "subdir2/file5.js");
  });

  it("javascriptWithFileMarkdown", () => {
    const response = `
// \`subdir2/file5.js\`
const x = 1;
`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "subdir2/file5.js");
  });
});
