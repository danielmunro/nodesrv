import { Column, Entity, Generated, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { RoomEntity } from "../../room/entity/roomEntity"
import { MobEntity } from "./mobEntity"

@Entity()
export default class MobLocationEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @OneToOne(() => MobEntity)
  public mob: MobEntity

  @ManyToOne(() => RoomEntity)
  public room: RoomEntity
}
