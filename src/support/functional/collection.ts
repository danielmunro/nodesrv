export async function asyncForEach(collection: any[], fn: (item: any) => Promise<void>): Promise<void> {
  for (const element of collection) {
    await fn(element)
  }
}
