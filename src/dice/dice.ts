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
