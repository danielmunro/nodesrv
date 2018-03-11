import {Entity, PrimaryGeneratedColumn, Column, Generated, OneToMany} from "typeorm"
import { Exit } from "./exit"
import { Mob } from "../../mob/model/mob"

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    @Generated("uuid")
    uuid: string

    @Column("text")
    name: string

    @Column("text")
    description: string

    @OneToMany(type => Exit, exit => exit.source, { eager: true })
    exits: Exit[] = []

    @OneToMany(type => Exit, exit => exit.destination, { eager: true })
    entrances: Exit[] = []

    @OneToMany(type => Mob, mob => mob.room)
    mobs: Mob[] = []
}