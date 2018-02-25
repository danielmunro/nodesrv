import roll from "./../dice/dice"

export class HitDam {
  public readonly hit: number
  public readonly dam: number

  constructor(hit: number, dam: number) {
    this.hit = hit
    this.dam = dam
  }

  public getHitRoll(): number {
    return roll(this.hit, this.dam)
  }
}
