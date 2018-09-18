import { String } from "typescript-string-operations"

export function format(templateString: string, replacements): string {
  return String.Format(templateString, replacements)
}
