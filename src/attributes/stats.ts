export class Stats {
  public readonly str: number
  public readonly int: number
  public readonly wis: number
  public readonly dex: number
  public readonly con: number
  public readonly sta: number

  constructor(
    str: number,
    int: number,
    wis: number,
    dex: number,
    con: number,
    sta: number,
  ) {
    this.str = str
    this.int = int
    this.wis = wis
    this.dex = dex
    this.con = con
    this.sta = sta
  }
}
