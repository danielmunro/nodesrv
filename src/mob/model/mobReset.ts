import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Room } from "../../room/model/room"
import { Disposition } from "../disposition"
import { Mob } from "./mob"

@Entity()
export default class MobReset {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @OneToOne(() => Mob, mob => mob.reset)
  public mob: Mob

  @ManyToOne(type => Room, room => room.mobResets)
  public room: Room

  @Column("text", { nullable: true })
  public disposition: Disposition
}
