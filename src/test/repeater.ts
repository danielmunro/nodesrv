export default async function(call, count: number = 5) {
  const times = new Array(count)
  times.fill(await call())
  return times
}
