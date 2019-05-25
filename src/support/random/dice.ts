import {getRandomInt} from "./helpers"

export default function roll(dice: number, sides: number): number {
  let value = 0
  while (dice > 0) {
    value += getRandomInt(sides)
    dice--
  }

  return value
}

export function simpleD4(callback: () => void) {
  if (roll(1, 4) === 1) {
    callback()
  }
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
