import {Column, Entity, Generated, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Inventory } from "../../item/model/inventory"
import { Mob } from "../../mob/model/mob"
import { Exit } from "./exit"

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    public id: number

    @Column("text")
    @Generated("uuid")
    public uuid: string

    @Column("text")
    public name: string

    @Column("text")
    public description: string

    @OneToMany((type) => Exit, (exit) => exit.source, { eager: true })
    public exits: Exit[] = []

    @OneToMany((type) => Exit, (exit) => exit.destination, { eager: true })
    public entrances: Exit[] = []

    @OneToMany((type) => Mob, (mob) => mob.room)
    public mobs: Mob[] = []

    @OneToOne((type) => Inventory, (inventory) => inventory.room)
    public inventory = new Inventory()

    public addMob(mob: Mob): void {
      mob.room.mobs = mob.room.mobs.filter((m) => m !== mob)
      mob.room = this
      this.mobs.push(mob)
    }
}
