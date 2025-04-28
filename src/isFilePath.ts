import * as path from "node:path";

const SPECIAL_FILE_NAMES = ["Dockerfile", "LICENSE", "README", "Makefile"];

/**
 * Checks if a given string looks like a valid file path (absolute or relative)
 * based on common patterns and reserved characters, requiring a file extension,
 * with exceptions for known special file names.
 *
 * Note: This is a heuristic check and doesn't guarantee the path exists
 * or is valid on all possible filesystems. It's based on the provided test cases.
 *
 * @param inputPath The string to check.
 * @returns True if the string appears to be a file path with an extension or a special file name, false otherwise.
 */
export function isFilePath(inputPath: string): boolean {
  if (typeof inputPath !== "string") {
    return false;
  }

  const trimmedPath = inputPath.trim();

  if (trimmedPath === "") {
    return false;
  }

  if (/[<>|*?"\x00-\x1F]/.test(trimmedPath)) {
    return false;
  }

  if (/^[A-Za-z]:/.test(trimmedPath)) {
    if (
      trimmedPath.length === 2 ||
      (trimmedPath.length > 2 &&
        trimmedPath[2] !== "\\" &&
        trimmedPath[2] !== "/")
    ) {
      return false;
    }
    if (trimmedPath.indexOf(":", 2) !== -1) {
      return false;
    }
  } else {
    if (trimmedPath.includes(":")) {
      return false;
    }
  }

  try {
    const baseName = path.basename(trimmedPath);

    if (SPECIAL_FILE_NAMES.includes(baseName)) {
      return true;
    }

    const extName = path.extname(baseName);

    if (!extName || extName === ".") {
      const lastSeparatorIndex = Math.max(
        trimmedPath.lastIndexOf("/"),
        trimmedPath.lastIndexOf("\\")
      );
      const lastSegment = trimmedPath.substring(lastSeparatorIndex + 1);

      if (!lastSegment || lastSegment === "." || lastSegment === "..") {
        return false;
      }

      const lastDotIndex = lastSegment.lastIndexOf(".");
      if (lastDotIndex === -1) {
        return false;
      }

      if (lastDotIndex === lastSegment.length - 1) {
        return false;
      }
    }

    const absoluteLastDotIndex = trimmedPath.lastIndexOf(".");
    if (
      absoluteLastDotIndex !== -1 &&
      /[\\/]/.test(trimmedPath.substring(absoluteLastDotIndex + 1))
    ) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
}
