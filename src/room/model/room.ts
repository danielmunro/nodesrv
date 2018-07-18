import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { SectionType } from "../../area/sectionType"
import { Inventory } from "../../item/model/inventory"
import match from "../../matcher/match"
import { Mob } from "../../mob/model/mob"
import { Region } from "../../region/model/region"
import getMovementCost from "../../region/movementCost"
import { Terrain } from "../../region/terrain"
import { Direction } from "../constants"
import { newRoom } from "../factory"
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

  @Column("integer", { nullable: true })
  public sectionType: SectionType = null

  @OneToMany((type) => Exit, (exit) => exit.source, { eager: true })
  public exits: Exit[] = []

  @OneToMany((type) => Exit, (exit) => exit.destination, { eager: true })
  public entrances: Exit[] = []

  @OneToMany((type) => Mob, (mob) => mob.room, { cascadeInsert: true })
  public mobs: Mob[] = []

  @OneToOne((type) => Inventory, { cascadeInsert: true, cascadeUpdate: true, eager: true })
  @JoinColumn()
  public inventory: Inventory = new Inventory()

  @ManyToOne((type) => Region, (region) => region.rooms, { eager: true })
  public region: Region

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

  public isDirectionFree(direction: Direction): boolean {
    return !this.exits.find((e) => e.direction === direction)
  }

  public toString(): string {
    return `(${this.id}) ${this.name}

${this.description}

Exits [${this.getExitsString()}]`
  }

  public copy(): Room {
    return newRoom(this.name, this.description)
  }

  public getMovementCost() {
    return getMovementCost(this.region ? this.region.terrain : Terrain.Other)
  }

  private getExitsString(): string {
    return this.exits.sort((a, b) => a.direction > b.direction ? 1 : -1).reduce((combined: string, current: Exit) => {
      return combined + current.direction.toString()[0]
    }, "")
  }
}
