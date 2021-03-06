import { Column, Entity, Generated, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import v4 from "uuid"
import { ItemEntity } from "./itemEntity"

@Entity()
export default class FoodEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @Column({ default: 1 })
  public foodAmount: number = 1

  @Column({ default: 1 })
  public drinkAmount: number = 0

  @OneToOne(() => ItemEntity, item => item.food)
  public item: ItemEntity
}
