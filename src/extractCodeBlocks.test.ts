import { test } from "node:test";
import { strict as assert } from "assert";
import { extractCodeBlocks } from "./extractCodeBlocks.js";

test("extracts a single code block with previous line", () => {
  const response = `
Here is some JavaScript code:

\`\`\`javascript
console.log("Hello, World!");
\`\`\`
`;

  const expectedOutput = [
    {
      fileType: "javascript",
      content: 'console.log("Hello, World!");',
      previousLine: "Here is some JavaScript code:",
    },
  ];

  const result = Array.from(extractCodeBlocks(response));
  assert.deepStrictEqual(result, expectedOutput);
});

test("extracts multiple code blocks with previous lines", () => {
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
      previousLine: "Here is some TypeScript code:",
    },
    {
      fileType: "python",
      content: 'def greet(name):\n  print(f"Hello, {name}!")',
      previousLine: "And here is some Python:",
    },
  ];

  const result = Array.from(extractCodeBlocks(response));
  assert.deepStrictEqual(result, expectedOutput);
});

test("extracts multiple bare code blocks", () => {
  const response = `
\`\`\`typescript
const greet = (name: string) => {
  console.log(\`Hello, \${name}!\`);
};
\`\`\`
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
      previousLine: "",
    },
    {
      fileType: "python",
      content: 'def greet(name):\n  print(f"Hello, {name}!")',
      previousLine: "",
    },
  ];

  const result = Array.from(extractCodeBlocks(response));
  assert.deepStrictEqual(result, expectedOutput);
});

test("handles code blocks without a type with previous line", () => {
  const response = `
Here is a code block without a type:

\`\`\`
console.log("This is without a type block");
\`\`\`
  `;

  const expectedOutput = [
    {
      fileType: "",
      content: 'console.log("This is without a type block");',
      previousLine: "Here is a code block without a type:",
    },
  ];

  const result = Array.from(extractCodeBlocks(response));
  assert.deepStrictEqual(result, expectedOutput);
});

test("handles bare code blocks", () => {
  const response = `
\`\`\`
console.log("This is without a type block");
\`\`\`
  `;

  const expectedOutput = [
    {
      fileType: "",
      content: 'console.log("This is without a type block");',
      previousLine: "",
    },
  ];

  const result = Array.from(extractCodeBlocks(response));
  assert.deepStrictEqual(result, expectedOutput);
});

test("extracts no code blocks", () => {
  const response = `
No code blocks here, just regular text.
  `;

  const expectedOutput: {
    fileType: string;
    content: string;
    previousLine: string;
  }[] = [];

  const result = Array.from(extractCodeBlocks(response));
  assert.deepStrictEqual(result, expectedOutput);
});

test("handles empty input", () => {
  const response = ` `;

  const expectedOutput: {
    fileType: string;
    content: string;
    previousLine: string;
  }[] = [];

  const result = Array.from(extractCodeBlocks(response));
  assert.deepStrictEqual(result, expectedOutput);
});
