export class Vitals {
  public readonly hp: number
  public readonly mana: number
  public readonly mv: number

  constructor(
    hp,
    mana,
    mv,
  ) {
    this.hp = hp
    this.mana = mana
    this.mv = mv
  }
}
