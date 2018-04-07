export default function(thing: string, subject: string): boolean {
  return thing.split(" ").find((word) => word.startsWith(subject)) ? true : false
}
