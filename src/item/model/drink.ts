import { Column, Entity, Generated, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Liquid } from "../enum/liquid"
import { Item } from "./item"

@Entity()
export default class Drink {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("text")
  public liquid: Liquid

  @Column("integer", { nullable: true })
  public capacity: number

  @Column("integer")
  public drinkAmount: number

  @Column("integer")
  public foodAmount: number

  @OneToOne(() => Item, item => item.food)
  public item: Item
}
