export function all(collection, filter): boolean {
  return collection.filter(filter).length === collection.length
}
