import {Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"

@Entity()
export default class Shop {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("integer")
  public buyModifier: number

  @Column("integer")
  public sellModifier: number

  @Column("integer")
  public openHour: number

  @Column("integer")
  public closeHour: number
}
