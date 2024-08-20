export function extractCommentString(code: string) {
  // Match for the CSS file comment pattern
  const multilineCommentRegex = /\/\*\s*(\S+)\s*\*\//g; // Matches /* filename */
  const singleLineCommentRegex = /\/\/\s*(\S+)/g; // Matches // filename

  // Check for each type of comment and return the first match found
  const match =
    multilineCommentRegex.exec(code) || singleLineCommentRegex.exec(code);

  // If a match is found, return the captured filename
  if (match && match[1]) return match[1].trim(); // Return the filename without extra spaces
}
