import roll from "./../dice"

export class HitDam {
  private hit: number
  private dam: number

  constructor(
    hit,
    dam,
  ) {
    this.hit = hit
    this.dam = dam
  }

  public getHitRoll(): number {
    return roll(this.hit, this.dam)
  }
}
