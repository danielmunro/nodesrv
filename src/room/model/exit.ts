import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Direction } from "../constants"
import { Room } from "./room"
import Door from "./door"

@Entity()
export class Exit {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public direction: Direction

  @ManyToOne(() => Room, (room) => room.exits)
  public source: Room

  @ManyToOne(() => Room)
  public destination: Room

  @OneToOne(() => Door, { eager: true })
  @JoinColumn()
  public door: Door
}
