import {Entity, PrimaryGeneratedColumn, Column, Generated, OneToOne, OneToMany} from "typeorm"
import { Room } from "../../room/model/room"
import { Mob } from "../../mob/model/mob"

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    @Generated("uuid")
    uuid: string

    @Column("text")
    name: string

    @OneToOne(type => Room)
    room: Room

    @OneToMany(type => Mob, mob => mob.player)
    mobs: Mob[]
}