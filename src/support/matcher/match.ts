export default function(thing: string, subject: string): boolean {
  return thing.split(" ").some((word) => word.startsWith(subject))
}
