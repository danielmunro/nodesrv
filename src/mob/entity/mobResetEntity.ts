import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import v4 from "uuid"
import { RoomEntity } from "../../room/entity/roomEntity"
import { Disposition } from "../enum/disposition"
import { MobEntity } from "./mobEntity"

@Entity()
export default class MobResetEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @ManyToOne(() => MobEntity, mob => mob.mobResets, { eager: true })
  @JoinColumn()
  public mob: MobEntity

  @ManyToOne(() => RoomEntity, room => room.mobResets, { eager: true })
  @JoinColumn()
  public room: RoomEntity

  @Column("text", { nullable: true })
  public disposition: Disposition

  @Column()
  public maxQuantity: number

  @Column({ nullable: true })
  public maxPerRoom: number
}
