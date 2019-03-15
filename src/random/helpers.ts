import roll from "./dice"

export function pickOne(collection) {
  return collection[Math.floor(Math.random() * collection.length)]
}

export function getRandomInt(max: number): number {
  return getRandomIntFromRange(1, max)
}

export function getRandomIntFromRange(min: number, max: number): number {
  return min + Math.floor(Math.random() * Math.floor(max - min + 1))
}

export function coinFlip(): boolean {
  return roll(1, 2) === 1
}

export function onCoinFlipSuccess(callback): Promise<any> {
  if (coinFlip()) {
    return callback()
  }
}

export function percentRoll(): number {
  return getRandomInt(100)
}
