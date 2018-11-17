import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Inventory } from "../../item/model/inventory"
import { Mob } from "../../mob/model/mob"
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

  @OneToMany((type) => Mob, (mob) => mob.player, { eager: true, cascadeInsert: true, cascadeUpdate: true })
  public mobs: Mob[] = []

  public sessionMob: Mob

  public delay: number = 0

  public addMob(mob: Mob) {
    mob.isPlayer = true
    mob.player = this
    this.mobs.push(mob)
  }

  public setPassword(password: string): void {
    this.password = hash(password)
  }

  public getInventory(): Inventory {
    return this.sessionMob.inventory
  }

  public prompt(): string {
    const combined = this.sessionMob.getCombinedAttributes().vitals
    const vitals = this.sessionMob.vitals
    return `${vitals.hp}/${combined.hp}hp ${vitals.mana}/${combined.mana}mana ${vitals.mv}/${combined.mv}mv -> `
  }

  public ownsMob(mob: Mob): boolean {
    return this.mobs.find((m) => m.uuid === mob.uuid) !== undefined
  }
}
