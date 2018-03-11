import {Entity, PrimaryGeneratedColumn, Column, Generated, ManyToOne, OneToOne} from "typeorm"
import { Direction } from "../constants"
import { Room } from "./room"

@Entity()
export class Exit {

    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    direction: Direction

    @ManyToOne(type => Room, room => room.exits)
    source: Room

    @ManyToOne(type => Room)
    destination: Room
}