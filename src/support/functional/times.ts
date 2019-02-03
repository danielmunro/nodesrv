export default async function doNTimes(count: number, fn: () => any) {
  const results = []
  for (let i = 0; i < count; i++) {
    results.push(await fn())
  }

  return results
}

export async function doNTimesOrUntilTruthy(count: number, fn: () => any): Promise<any> {
  for (let i = 0; i < count; i++) {
    const result = await fn()
    if (result) {
      return result
    }
  }
}
