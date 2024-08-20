export function trimChar(s: string, ends: string): string {
  // Create a regular expression that matches any character in the 'ends' string
  const regex = new RegExp(`^[${ends}]+|[${ends}]+$`, "g");

  // Use the replace method to remove the specified characters from the start and end of the string
  return s.replace(regex, "");
}

// console.log(trimChar("!!!Hello World!!!", "!")); // "Hello World"
// console.log(trimChar("xxHello Worldxx", "x"));   // "Hello World"
// console.log(trimChar("   Hello World   ", " ")); // "Hello World"
// console.log(trimChar("abcHello Worldcba", "abc")); // "Hello World"
