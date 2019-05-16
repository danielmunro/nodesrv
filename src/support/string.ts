import { String } from "typescript-string-operations"

export function format(templateString: string, ...replacements: string[]): string {
  return String.Format(templateString, ...replacements)
}
