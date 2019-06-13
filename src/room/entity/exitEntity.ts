import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import {Direction} from "../enum/direction"
import DoorEntity from "./doorEntity"
import { RoomEntity } from "./roomEntity"

@Entity()
export class ExitEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public direction: Direction

  @ManyToOne(() => RoomEntity, room => room.exits)
  public source: RoomEntity

  @ManyToOne(() => RoomEntity, room => room.entrances)
  public destination: RoomEntity

  @OneToOne(() => DoorEntity, { eager: true })
  @JoinColumn()
  public door: DoorEntity
}
