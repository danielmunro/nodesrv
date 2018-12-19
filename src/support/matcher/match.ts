export default function match(thing, search: string): boolean {
  const lowerSearch = search.toLowerCase()
  return thing.toLowerCase().split(" ").some(word => word.startsWith(lowerSearch))
}
