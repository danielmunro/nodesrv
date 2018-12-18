export default function(thing: string, search: string): boolean {
  const lowerSearch = search.toLowerCase()
  return thing.toLowerCase().split(" ").some(word => word.startsWith(lowerSearch))
}
