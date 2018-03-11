import {Entity, PrimaryGeneratedColumn, Column, Generated, OneToOne, OneToMany} from "typeorm"
import { Direction } from "../../room/constants"
import { Exit } from "../../room/model/exit"
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

    @OneToMany(type => Mob, mob => mob.player)
    mobs: Mob[] = []

    sessionMob: Mob

    moveTo(room: Room): void {
      room.addMob(this.sessionMob)
    }

    getExit(direction: Direction): Exit | null {
      return this.sessionMob.room.exits.find((exit) => exit.direction === direction.toString())
    }
}