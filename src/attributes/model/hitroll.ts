import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import Attributes from "./attributes"

@Entity()
export default class Hitroll {
  public static create(hit: number, dam: number) {
    const hitroll = new Hitroll()
    hitroll.hit = hit
    hitroll.dam = dam
    return hitroll
  }

  @PrimaryGeneratedColumn()
  public id: number

  @Column("integer")
  public hit: number = 0

  @Column("integer")
  public dam: number = 0
}
