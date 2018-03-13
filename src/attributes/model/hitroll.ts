import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

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
  public hit: number

  @Column("integer")
  public dam: number
}
