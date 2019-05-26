import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as uuid from "uuid"
import { Inventory } from "../../item/model/inventory"
import MobReset from "../../mob/model/mobReset"
import { Terrain } from "../../region/enum/terrain"
import { Region } from "../../region/model/region"
import getMovementCost from "../../region/movementCost"
import {Direction} from "../enum/direction"
import { Exit } from "./exit"
import {createInventory} from "../../item/factory/inventoryFactory"

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = uuid()

  @Column("integer", { nullable: true })
  public canonicalId: number

  @Column("text")
  public name: string

  @Column("text")
  public description: string

  @Column("text")
  public area: string

  @OneToMany(() => Exit, (exit) => exit.source, { eager: true })
  public exits: Exit[] = []

  @OneToMany(() => Exit, (exit) => exit.destination, { eager: true })
  public entrances: Exit[] = []

  @OneToOne(() => Inventory, { eager: true, cascade: true })
  @JoinColumn()
  public inventory: Inventory = createInventory()

  @ManyToOne(() => Region, (region) => region.rooms, { eager: true })
  public region: Region

  @OneToMany(() => MobReset, reset => reset.room)
  public mobResets: MobReset[] = []

  public isDirectionFree(direction: Direction): boolean {
    return !this.exits.find((e) => e.direction === direction)
  }

  public toString(): string {
    return `(${this.id}) ${this.name}

${this.description}

Exits [${this.getExitsString()}]`
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
