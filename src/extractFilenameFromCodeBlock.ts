import { extractCommentString } from "./extractCommentString.js";
import { isFilePath } from "./isFilePath.js";
import { trimChar } from "./trimChar.js";

export function extractFilenameFromCodeBlock(
  content: string
): string | undefined {
  const firstLine = content.trim().split("\n")[0];
  if (!firstLine) return;
  const commentContent = extractCommentString(firstLine);
  if (!commentContent) return;

  const trimmed = trimChar(commentContent, "`");

  if (isFilePath(trimmed)) return trimmed;
}
