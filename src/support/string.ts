import { String } from "typescript-string-operations"

export function format(templateString: string, ...replacements: any): string {
  return String.Format(templateString, ...replacements)
}
