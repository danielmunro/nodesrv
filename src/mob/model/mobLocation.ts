import { Column, Entity, Generated, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { RoomEntity } from "../../room/entity/roomEntity"
import { Mob } from "./mob"

@Entity()
export default class MobLocation {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @OneToOne(() => Mob)
  public mob: Mob

  @ManyToOne(() => RoomEntity)
  public room: RoomEntity
}
