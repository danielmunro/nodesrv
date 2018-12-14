import { Column, Entity, Generated, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Liquid } from "../liquid"
import { Item } from "./item"

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
  public drinkAmount: number = 0

  @Column("integer")
  public foodAmount: number = 0

  @OneToOne(type => Item, item => item.food)
  public item
}
