export default async function doNTimes(count, fn) {
  const results = []
  for (let i = 0; i < count; i++) {
    results.push(await fn())
  }

  return results
}
