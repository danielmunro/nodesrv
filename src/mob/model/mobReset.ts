import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Room } from "../../room/model/room"
import { Disposition } from "../enum/disposition"
import { Mob } from "./mob"

@Entity()
export default class MobReset {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @ManyToOne(() => Mob, mob => mob.mobResets)
  @JoinColumn()
  public mob: Mob

  @ManyToOne(() => Room, room => room.mobResets)
  @JoinColumn()
  public room: Room

  @Column("text", { nullable: true })
  public disposition: Disposition

  @Column("integer")
  public maxQuantity: number

  @Column("integer", { nullable: true })
  public maxPerRoom: number
}
