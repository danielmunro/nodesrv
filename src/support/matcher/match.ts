export default function match(thing: string, search: string): boolean {
  const lowerSearch = search.toLowerCase()
  if (thing.toLowerCase() === lowerSearch) {
    return true
  }
  return thing.toLowerCase().split(" ").some(word => word.startsWith(lowerSearch))
}
