import { isFilePath } from "./isFilePath.js";
import { trimChar } from "./trimChar.js";

export function extractFilenameFromLine(previousLine: string) {
  previousLine = trimChar(previousLine, "#");
  previousLine = trimChar(previousLine, "`");
  previousLine = trimChar(previousLine, " ");

  if (isFilePath(previousLine)) return previousLine;
}
