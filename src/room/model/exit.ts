import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import {Direction} from "../enum/direction"
import Door from "./door"
import { Room } from "./room"

@Entity()
export class Exit {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public direction: Direction

  @ManyToOne(() => Room, room => room.exits)
  public source: Room

  @ManyToOne(() => Room, room => room.entrances)
  public destination: Room

  @OneToOne(() => Door, { eager: true })
  @JoinColumn()
  public door: Door
}
