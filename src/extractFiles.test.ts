import { strict as assert } from "assert";
import { describe, it } from "node:test";
import { extractFilesFromAIResponse } from "./extractFiles.js";

describe("extractFilesFromAIResponse", () => {
  const contextFiles = {
    "file1.ts": "existing TypeScript file",
    "file2.js": "existing JavaScript file",
    "file3.json": "existing JSON file",
    "subdir/file4.css": "existing CSS file in subdir",
  };

  it("TypeScript", () => {
    const response =
      "Here is some TypeScript code:\n```typescript\nconst x: number = 1;\n```";
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(result["file1.ts"], "const x: number = 1;\n");
  });

  it("JavaScript", () => {
    const response =
      "Here is some JavaScript code:\n```javascript\nconst x = 1;\n```";
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(result["file2.js"], "const x = 1;\n");
  });

  it("JSON", () => {
    const response = 'Here is some JSON data:\n```json\n{"key": "value"}\n```';
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(result["file3.json"], '{"key": "value"}\n');
  });

  it("unknownType", () => {
    const response =
      "Here is some unsupported language:\n```unsupported\ndoes not matter\n```";
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(result[Object.keys(result)[0]!], "does not matter\n");
  });

  it("noType", () => {
    const response = "Here is some text:\n```\ndoes not matter\n```";
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(result[Object.keys(result)[0]!], "does not matter\n");
  });

  it("multipleDifferentType", () => {
    const response = `
Here is TypeScript:
\`\`\`typescript
const x: number = 1;
\`\`\`

And here is JavaScript:
\`\`\`javascript
const y = 2;
\`\`\`
    `;
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 2);
    assert.strictEqual(result["file1.ts"], "const x: number = 1;\n");
    assert.strictEqual(result["file2.js"], "const y = 2;\n");
  });

  it("multipleSameType", () => {
    const response = `
Here is TypeScript:
\`\`\`typescript
const x: number = 1;
\`\`\`

And here is another TypeScript:
\`\`\`typescript
const y: number = 2;
\`\`\`
    `;
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.deepEqual(Object.keys(result), ["file1.ts"]);
    assert.strictEqual(result["file1.ts"], "const y: number = 2;\n");
  });

  it("uniqueFilename", () => {
    const response = "Here is some HTML:\n```html\n<div>Hello World</div>\n```";
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.match(Object.keys(result)[0] ?? "", /\.html$/); // Ensure the filename ends with .html
  });

  it("subdir", () => {
    const response =
      "Here is some CSS code:\n```css\nbody { background-color: white; }\n```";
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(
      result["subdir/file4.css"],
      "body { background-color: white; }\n"
    );
  });

  it("cssWithFileComment", () => {
    const response = `
Here is some code:
\`\`\`css
/* subdir2/file5.css */
body { background-color: white; }
\`\`\`
`;
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(
      result["subdir2/file5.css"],
      "body { background-color: white; }\n"
    );
  });

  it("cssWithFileMarkdown", () => {
    const response = `
Here is some code:
\`\`\`css
/* \`subdir2/file5.css\` */
body { background-color: white; }
\`\`\`
`;
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(
      result["subdir2/file5.css"],
      "body { background-color: white; }\n"
    );
  });

  it("javascriptWithFileComment", () => {
    const response = `
Here is some code:
\`\`\`javascript
// \`subdir2/file5.js\`
const x = 1;
\`\`\`
`;
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(result["subdir2/file5.js"], "const x = 1;\n");
  });

  it("javascriptWithFilePathOnPrevLine", () => {
    const response = `
\`subdir2/file5.js\`
\`\`\`javascript
const x = 1;
\`\`\`
`;
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(result["subdir2/file5.js"], "const x = 1;\n");
  });

  it("javascriptWithFilePathOnPrevLine2", () => {
    const response = `
### \`subdir2/file5.js\`
\`\`\`javascript
const x = 1;
\`\`\`
`;
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(result["subdir2/file5.js"], "const x = 1;\n");
  });

  it("javascriptWithFilePathOnPrevLine3", () => {
    const response = `
Here is some code in file "subdir2/file5.js":

\`\`\`javascript
const x = 1;
\`\`\`
`;
    const result = extractFilesFromAIResponse(response, contextFiles);

    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(result["subdir2/file5.js"], "const x = 1;\n");
  });
});
