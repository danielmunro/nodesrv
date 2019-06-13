import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as uuid from "uuid"
import { InventoryEntity } from "../../item/entity/inventoryEntity"
import MobResetEntity from "../../mob/entity/mobResetEntity"
import { RegionEntity } from "../../region/entity/regionEntity"
import { Terrain } from "../../region/enum/terrain"
import {Direction} from "../enum/direction"
import { ExitEntity } from "./exitEntity"

@Entity()
export class RoomEntity {
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

  @OneToMany(() => ExitEntity, (exit) => exit.source, { cascade: true, eager: true })
  public exits: ExitEntity[]

  @OneToMany(() => ExitEntity, (exit) => exit.destination, { eager: true })
  public entrances: ExitEntity[]

  @OneToOne(() => InventoryEntity, { cascade: true, eager: true })
  @JoinColumn()
  public inventory: InventoryEntity

  @ManyToOne(() => RegionEntity, (region) => region.rooms, { cascade: true, eager: true })
  public region: RegionEntity

  @OneToMany(() => MobResetEntity, reset => reset.room)
  public mobResets: MobResetEntity[]

  public isDirectionFree(direction: Direction): boolean {
    return !this.exits.find((e) => e.direction === direction)
  }

  public toString(): string {
    return `(${this.id}) ${this.name}

${this.description}

Exits [${this.getExitsString()}]`
  }

  public getMovementCost() {
    const terrain = this.region ? this.region.terrain : Terrain.Other

    if (terrain === Terrain.Mountains || terrain === Terrain.Water) {
      return 2
    }

    if (terrain === Terrain.Forest) {
      return 1.5
    }

    if (terrain === Terrain.Settlement) {
      return 0.5
    }

    return 1
  }

  private getExitsString(): string {
    return this.exits.sort((a, b) =>
      a.direction > b.direction ? 1 : -1).reduce((combined: string, current: ExitEntity) => {
      return combined + current.direction.toString()[0]
    }, "")
  }
}
