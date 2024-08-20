import { extractCodeBlocks } from "./extractCodeBlocks.js";
import { extractFilenameFromCodeBlock } from "./extractFilenameFromCodeBlock.js";
import { extractFilenameFromLine } from "./extractFilenameFromLine.js";

/**
 * Extracts files from an AI response string based on code blocks and their types.
 *
 * The function identifies code blocks within the response string using a regular expression and categorizes them by type
 * (e.g., TypeScript, JavaScript, JSON, HTML, CSS). It then maps each code block to a filename, either using an existing context
 * file or generating a new unique filename. The resulting object contains the filenames as keys and the extracted code as values.
 *
 * @param {string} response - The response string containing code blocks to be extracted.
 * @param {Record<string, string>} contextFiles - An object where keys are filenames and values are file contents.
 *        This is used to match existing files by extension.
 *
 * @returns {Record<string, string>} An object where keys are filenames and values are the corresponding code contents extracted
 *         from the response string. New filenames are generated for types not present in the context files.
 *
 * @example
 * const response = `
 * Here is TypeScript:
 * \`\`\`typescript
 * const x: number = 1;
 * \`\`\`
 *
 * And here is JavaScript:
 * \`\`\`javascript
 * const y = 2;
 * \`\`\`
 * `;
 *
 * const contextFiles = {
 *   "file1.ts": "existing TypeScript file",
 *   "file2.js": "existing JavaScript file",
 *   "file3.json": "existing JSON file",
 * };
 *
 * const result = extractFilesFromAIResponse(response, contextFiles);
 *
 * // result would be:
 * // {
 * //   "file1.ts": "const x: number = 1;\n",
 * //   "file2.js": "const y = 2;\n"
 * // }
 */

export function extractFilesFromAIResponse(
  response: string,
  contextFiles: Record<string, string>
): Record<string, string> {
  const fileContents: Record<string, string> = {};

  for (const { fileType, content, previousLine } of extractCodeBlocks(
    response
  )) {
    // Infer the file extension based on the type
    let fileExtension: string;
    switch (fileType) {
      case "typescript":
        fileExtension = ".ts";
        break;
      case "javascript":
        fileExtension = ".js";
        break;
      case "json":
        fileExtension = ".json";
        break;
      case "html":
        fileExtension = ".html";
        break;
      case "css":
        fileExtension = ".css";
        break;
      default:
        fileExtension = ".txt";
    }

    const extractedPath = extractFilenameFromCodeBlock(content);
    const trimmedContent = extractedPath
      ? content.split("\n").slice(1).join("\n")
      : content;

    const extractedPathPrevLine = extractFilenameFromLine(previousLine);

    // Find a matching context file based on the file type
    const matchingTypes = Object.keys(contextFiles).filter((filePath) =>
      filePath.endsWith(fileExtension)
    );
    const guessedPath =
      matchingTypes.length === 1 ? matchingTypes[0] : undefined;

    const randomPath = fileType + randomId() + fileExtension;

    const key =
      extractedPath ?? extractedPathPrevLine ?? guessedPath ?? randomPath;

    fileContents[key] = mergeFile(fileContents[key], trimmedContent);
  }

  return fileContents;
}

const randomId = () => Math.random().toFixed(5).slice(2);

function mergeFile(old: string | undefined, diff: string): string {
  return diff + "\n";
}
