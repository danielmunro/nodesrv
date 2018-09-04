import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Inventory } from "../../item/model/inventory"
import { Mob } from "../../mob/model/mob"
import { Direction } from "../../room/constants"
import { Exit } from "../../room/model/exit"
import { Room } from "../../room/model/room"
import { AuthorizationLevel } from "../authorizationLevel"
import hash from "../password/hash"

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string

  @Column("text", { nullable: true })
  public name: string

  @Column("text", { unique: true })
  public email: string

  @Column("text")
  public password: string

  @Column("integer", { default: AuthorizationLevel.Mortal })
  public authorizationLevel: AuthorizationLevel = AuthorizationLevel.Mortal

  @OneToMany((type) => Mob, (mob) => mob.player, { cascadeInsert: true, cascadeUpdate: true })
  public mobs: Mob[] = []

  public sessionMob: Mob

  public delay: number = 0

  public setPassword(password: string): void {
    this.password = hash(password)
  }

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

  public prompt(): string {
    const combined = this.sessionMob.getCombinedAttributes().vitals
    const vitals = this.sessionMob.vitals
    return `${vitals.hp}/${combined.hp}hp ${vitals.mana}/${combined.mana}mana ${vitals.mv}/${combined.mv}mv -> `
  }
}
