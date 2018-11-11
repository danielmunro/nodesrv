import { Column, Entity, Generated, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Mob } from "./mob"
import { Room } from "../../room/model/room"
import { Disposition } from "../disposition"

@Entity()
export default class Reset {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @OneToOne(() => Mob)
  public mob: Mob

  @ManyToOne(type => Room, room => room.roomResets)
  public room: Room

  @Column("text")
  public disposition: Disposition
}
