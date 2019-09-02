import {Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import { InventoryEntity } from "../../item/entity/inventoryEntity"
import { MobEntity } from "../../mob/entity/mobEntity"
import hash from "../password/hash"
import {PaymentMethodEntity} from "./paymentMethodEntity"

@Entity()
export class PlayerEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string

  @Column({ nullable: true })
  public name: string

  @Column({ unique: true })
  public email: string

  @Column()
  public password: string

  @Column("timestamp", { nullable: true })
  public lastLogin: Date

  @Column({ default: 0 })
  public kills: number

  @Column({ default: 0 })
  public deaths: number

  @OneToMany(() => MobEntity, mob => mob.player, { eager: true, cascade: true })
  public mobs: MobEntity[]

  @OneToMany(() => PaymentMethodEntity, paymentMethod => paymentMethod.player, { eager: true, cascade: true })
  public paymentMethods: PaymentMethodEntity[]

  @Column({ nullable: true })
  public stripeCustomerId: string

  @Column({ nullable: true })
  public stripeSubscriptionId: string

  public sessionMob: MobEntity

  public delay: number = 0

  public isAfk: boolean = false

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
}
