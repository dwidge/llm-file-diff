/**
 * Determines whether the given string is likely a valid file path.
 *
 * @param {string} path - The string to check.
 * @returns {boolean} True if the string is a valid file path; otherwise, false.
 */
export function isFilePath(path: string): boolean {
  // Check for non-empty string and some common characteristics of file paths
  if (typeof path !== "string" || path.length === 0) {
    return false;
  }

  // Updated regular expression to validate both absolute and relative file paths
  const filePathRegex =
    /^(?:[a-zA-Z]:)?(?:[\\/].+|[^\\/]+)(?:[\\/][\w .-]+)*\.\w+$/;

  // Check for additional invalid characters like colons or quotes that shouldn't be in file paths
  const invalidCharactersRegex = /[<>"'`|?*]/;

  // Return false if the path contains invalid characters or does not match the file path regex
  return !invalidCharactersRegex.test(path) && filePathRegex.test(path);
}
