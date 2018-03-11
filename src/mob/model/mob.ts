import {Entity, PrimaryGeneratedColumn, Column, Generated, ManyToOne} from "typeorm"
import { Room } from "../../room/model/room";

@Entity()
export class Mob {
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    @Generated("uuid")
    uuid: string

    @Column("text")
    name: string

    @Column("text")
    description: string

    @ManyToOne(type => Room, room => room.mobs)
    room: Room
}