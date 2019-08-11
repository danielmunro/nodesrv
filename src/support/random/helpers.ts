import roll from "./dice"

export function pickOne(collection: any[]) {
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

export function onCoinFlipSuccess(callback: any): Promise<any> {
  return coinFlip() ? callback() : undefined
}

export function percentRoll(): number {
  return getRandomInt(100)
}
