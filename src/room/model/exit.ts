import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import { Direction } from "../constants"
import { Room } from "./room"

@Entity()
export class Exit {
    @PrimaryGeneratedColumn()
    public id: number

    @Column("text")
    public direction: Direction

    @ManyToOne((type) => Room, (room) => room.exits)
    public source: Room

    @ManyToOne((type) => Room)
    public destination: Room
}
