import {Column, Entity, Generated, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Inventory } from "../../item/model/inventory"
import match from "../../matcher/match"
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

    @OneToMany((type) => Mob, (mob) => mob.room, { cascadeInsert: true })
    public mobs: Mob[] = []

    @OneToOne((type) => Inventory)
    @JoinColumn()
    public inventory = new Inventory()

    public addMob(mob: Mob): void {
      if (mob.room) {
        mob.room.removeMob(mob)
      }
      mob.room = this
      this.mobs.push(mob)
    }

    public removeMob(mob: Mob): void {
      this.mobs = this.mobs.filter((m) => m !== mob)
    }

    public findMobByName(search: string): Mob | undefined {
      return this.mobs.find((m) =>  match(m.name, search))
    }
}
