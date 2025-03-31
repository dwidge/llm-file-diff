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
    /^(?:[a-zA-Z]:)?(?:[\\/].+|[^\\/]+)(?:[\\/][\w .~-]+)*\.\w+$/;

  // Check for additional invalid characters like colons or quotes that shouldn't be in file paths
  const invalidCharactersRegex = /[<>"'`|?*]/;

  // Check if path contains invalid characters or not following valid file path structure
  if (invalidCharactersRegex.test(path)) return false;
  if (!filePathRegex.test(path)) return false;

  // Ensure there is at most one colon in the path
  const colonCount = (path.match(/:/g) || []).length;
  if (colonCount > 1) return false;

  // Ensure there are no spaces in the path
  if (/\s/.test(path)) return false;

  return true;
}
