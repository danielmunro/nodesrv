export default function match(thing, search: string): boolean {
  const lowerSearch = search.toLowerCase()
  if (thing.toLowerCase() === search) {
    return true
  }
  return thing.toLowerCase().split(" ").some(word => word.startsWith(lowerSearch))
}
