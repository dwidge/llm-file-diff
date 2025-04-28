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

  it("should extract .env", () => {
    const response = `// .env\nVAR=value`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, ".env");
  });

  it("should extract ./.env", () => {
    const response = `// ./.env\nVAR=value`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "./.env");
  });

  it("should extract a/b/c/.env.local", () => {
    const response = `// a/b/c/.env.local\nVAR=value`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "a/b/c/.env.local");
  });

  it("should extract .next/(cache)/route.js", () => {
    const response = "// .next/(cache)/route.js";
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, ".next/(cache)/route.js");
  });

  it("should extract (config)/layout.tsx", () => {
    const response = `// (config)/layout.tsx\n<div>...</div>`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "(config)/layout.tsx");
  });

  it("should extract src/(auth)/login/page.tsx", () => {
    const response = `// src/(auth)/login/page.tsx\nexport default function Login() {...}`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "src/(auth)/login/page.tsx");
  });

  it("should extract path with spaces", () => {
    const response = `// \`path/with spaces/file.txt\`\ncontent`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "path/with spaces/file.txt");
  });

  it("should extract my.file.name.txt", () => {
    const response = `// my.file.name.txt\ncontent`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "my.file.name.txt");
  });

  it("should extract quoted .env", () => {
    const response = `// \`.env\`\nVAR=value`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, ".env");
  });

  it("should extract quoted (config)/layout.tsx", () => {
    const response = `// \`(config)/layout.tsx\`\n<div>...</div>`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "(config)/layout.tsx");
  });

  it("should extract path with square brackets", () => {
    const response = `// app/[locale]/page.tsx\ncontent`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "app/[locale]/page.tsx");
  });

  it("should extract path with spread syntax", () => {
    const response = `// app/(marketing)/[...slug]/page.tsx\ncontent`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, "app/(marketing)/[...slug]/page.tsx");
  });

  it("should return undefined if first line is not a comment", () => {
    const response = `
const x = 1; // This is not a file path comment
// some other comment
`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, undefined);
  });

  it("should return undefined if comment does not contain a file path", () => {
    const response = `
// This is just a regular comment
const x = 1;
`;
    const result = extractFilenameFromCodeBlock(response);
    assert.strictEqual(result, undefined);
  });
});
