export default function(modifier: number) {
  if (modifier < 0) {
    return 1 / (Math.abs(modifier) + 1)
  }

  if (modifier > 10) {
    return 10 + (modifier / 10)
  }

  if (modifier === 0) {
    return 1
  }

  return modifier
}
