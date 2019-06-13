import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { InventoryEntity } from "../../item/entity/inventoryEntity"
import { MobEntity } from "../../mob/entity/mobEntity"
import hash from "../password/hash"

@Entity()
export class PlayerEntity {
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

  @OneToMany(() => MobEntity, mob => mob.player, { eager: true, cascade: true })
  public mobs: MobEntity[]

  public sessionMob: MobEntity

  public delay: number = 0

  public setPassword(password: string): void {
    this.password = hash(password)
  }

  public getInventory(): InventoryEntity {
    return this.sessionMob.inventory
  }

  public prompt(): string {
    const combined = this.sessionMob.attribute().combine()
    return `${this.sessionMob.hp}/${combined.hp}hp `
      + `${this.sessionMob.mana}/${combined.mana}mana ${this.sessionMob.mv}/${combined.mv}mv -> `
  }

  public ownsMob(mob: MobEntity): boolean {
    return !!this.mobs.find(m => m.uuid === mob.uuid)
  }
}
