import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Liquid } from "../liquid"

@Entity()
export default class Drink {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("text")
  public liquid: Liquid = Liquid.Water

  @Column("integer")
  public capacity: number = 0

  @Column("integer")
  public amount: number = 0

  @Column("integer")
  public nourishment: number = 0
}
