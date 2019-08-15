import {Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm"
import v4 from "uuid"

@Entity()
export default class ShopEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @Column()
  public buyModifier: number

  @Column()
  public sellModifier: number

  @Column()
  public openHour: number

  @Column()
  public closeHour: number
}
