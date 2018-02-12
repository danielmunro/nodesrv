export default function roll(hit: number, dam: number): number {
  let value = 0
  while (hit > 0) {
    value += getRandomInt(dam)
    hit--
  }

  return value
}

function getRandomInt(max: number): number {
  return 1 + Math.floor(Math.random() * Math.floor(max - 1))
}
