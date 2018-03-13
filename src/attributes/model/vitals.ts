import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export default class Vitals {
  public static create(hp: number, mana: number, mv: number): Vitals {
    const vitals = new Vitals()
    vitals.hp = hp
    vitals.mana = mana
    vitals.mv = mv

    return vitals
  }

  @PrimaryGeneratedColumn()
  public id: number

  @Column("integer")
  public hp: number

  @Column("integer")
  public mana: number

  @Column("integer")
  public mv: number
}
