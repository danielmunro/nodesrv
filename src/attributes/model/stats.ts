import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export default class Stats {
  public static create(str: number, int: number, wis: number, dex: number, con: number, sta: number) {
    const stats = new Stats()
    stats.str = str
    stats.int = int
    stats.wis = wis
    stats.dex = dex
    stats.con = con
    stats.sta = sta
    return stats
  }

  @PrimaryGeneratedColumn()
  public id: number

  @Column("integer")
  public str: number

  @Column("integer")
  public int: number

  @Column("integer")
  public wis: number

  @Column("integer")
  public dex: number

  @Column("integer")
  public con: number

  @Column("integer")
  public sta: number
}
