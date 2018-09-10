export default function doNTimes(count, fn) {
  const results = []
  for (let i = 0; i < count; i++) {
    results.push(fn())
  }

  return results
}
