import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import Attributes from "./attributes"

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
  public str: number = 0

  @Column("integer")
  public int: number = 0

  @Column("integer")
  public wis: number = 0

  @Column("integer")
  public dex: number = 0

  @Column("integer")
  public con: number = 0

  @Column("integer")
  public sta: number = 0
}
