export default function roll(dice: number, sides: number): number {
  let value = 0
  while (dice > 0) {
    value += getRandomInt(sides)
    dice--
  }

  return value
}

export function simpleD4(callback) {
  if (roll(1, 4) === 1) {
    callback()
  }
}

export function coinFlip(): boolean {
  return roll(1, 2) === 1
}

export function onCoinFlipSuccess(callback): Promise<any> {
  if (coinFlip()) {
    return callback()
  }
}

export function getRandomInt(max: number): number {
  return 1 + Math.floor(Math.random() * Math.floor(max))
}

export class DiceRoller {
  private readonly diceSides: number
  private readonly rolls: number
  private readonly modifier: number

  constructor(diceSides: number, rolls: number, modifier: number) {
    this.diceSides = diceSides
    this.rolls = rolls
    this.modifier = modifier
  }

  public getRoll(): number {
    return roll(this.rolls, this.diceSides) + this.modifier
  }
}
