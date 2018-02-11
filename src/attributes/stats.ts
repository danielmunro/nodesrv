export class Stats {
  public readonly str: number
  public readonly int: number
  public readonly wis: number
  public readonly dex: number
  public readonly con: number
  public readonly sta: number

  constructor(
    str,
    int,
    wis,
    dex,
    con,
    sta,
  ) {
    this.str = str
    this.int = int
    this.wis = wis
    this.dex = dex
    this.con = con
    this.sta = sta
  }
}
