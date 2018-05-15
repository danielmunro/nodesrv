import {Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import { Inventory } from "../../item/model/inventory"
import { Mob } from "../../mob/model/mob"
import { Direction } from "../../room/constants"
import { Exit } from "../../room/model/exit"
import { Room } from "../../room/model/room"

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    public id: number

    @Column("text")
    @Generated("uuid")
    public uuid: string

    @Column("text", { nullable: true })
    public name: string

    @OneToMany((type) => Mob, (mob) => mob.player, { cascadeInsert: true, cascadeUpdate: true })
    public mobs: Mob[] = []

    public sessionMob: Mob

    public delay: number = 0

    public moveTo(room: Room): void {
      room.addMob(this.sessionMob)
    }

    public getExit(direction: Direction): Exit | null {
      return this.sessionMob.room.exits.find((exit) => exit.direction === direction.toString())
    }

    public getInventory(): Inventory {
      return this.sessionMob.inventory
    }

    public closeSession(): void {
      if (this.sessionMob) {
        this.sessionMob.room.removeMob(this.sessionMob)
      }
    }
}
