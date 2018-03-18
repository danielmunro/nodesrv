import { Attack } from "./attack"

export class Round {
  public readonly attack: Attack
  public readonly counter: Attack

  constructor(attack: Attack, counter: Attack = null) {
    this.attack = attack
    this.counter = counter
  }
}
