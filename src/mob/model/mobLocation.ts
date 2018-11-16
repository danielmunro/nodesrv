import { Column, Entity, Generated, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Room } from "../../room/model/room"
import { Mob } from "./mob"

@Entity()
export default class MobLocation {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @OneToOne(type => Mob)
  public mob: Mob

  @ManyToOne(type => Room)
  public room
}
