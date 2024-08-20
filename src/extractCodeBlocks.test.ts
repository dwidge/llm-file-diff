import { test } from "node:test";
import { strict as assert } from "assert";
import { extractCodeBlocks } from "./extractCodeBlocks.js";

test("extracts a single code block", () => {
  const response = `
Here is some JavaScript code:

\`\`\`javascript
console.log("Hello, World!");
\`\`\`
  `;

  const expectedOutput = [
    { fileType: "javascript", content: 'console.log("Hello, World!");' },
  ];

  const result = Array.from(extractCodeBlocks(response));
  assert.deepStrictEqual(result, expectedOutput);
});

test("extracts multiple code blocks", () => {
  const response = `
Here is some TypeScript code:

\`\`\`typescript
const greet = (name: string) => {
  console.log(\`Hello, \${name}!\`);
};
\`\`\`

And here is some Python:

\`\`\`python
def greet(name):
  print(f"Hello, {name}!")
\`\`\`
  `;

  const expectedOutput = [
    {
      fileType: "typescript",
      content:
        "const greet = (name: string) => {\n  console.log(`Hello, ${name}!`);\n};",
    },
    {
      fileType: "python",
      content: 'def greet(name):\n  print(f"Hello, {name}!")',
    },
  ];

  const result = Array.from(extractCodeBlocks(response));
  assert.deepStrictEqual(result, expectedOutput);
});

test("handles code blocks without a type", () => {
  const response = `
Here is a code block without a type:

\`\`\`
console.log("This is without a type block");
\`\`\`
  `;

  const expectedOutput = [
    { fileType: "", content: 'console.log("This is without a type block");' },
  ];

  const result = Array.from(extractCodeBlocks(response));
  assert.deepStrictEqual(result, expectedOutput);
});

test("extracts no code blocks", () => {
  const response = `
No code blocks here, just regular text.
  `;

  const expectedOutput: { fileType: string; content: string }[] = [];

  const result = Array.from(extractCodeBlocks(response));
  assert.deepStrictEqual(result, expectedOutput);
});

test("handles empty input", () => {
  const response = ` `;

  const expectedOutput: { fileType: string; content: string }[] = [];

  const result = Array.from(extractCodeBlocks(response));
  assert.deepStrictEqual(result, expectedOutput);
});
