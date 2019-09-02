import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import v4 from "uuid"
import {Aliases} from "../../action/type/aliases"
import { default as Attributes } from "../../attributes/entity/attributesEntity"
import { ItemEntity } from "../../item/entity/itemEntity"
import {AuthorizationLevel} from "../../player/enum/authorizationLevel"
import Maybe from "../../support/functional/maybe/maybe"
import { Standing } from "../enum/standing"
import Customization from "../specialization/customization"
import { MobEntity } from "./mobEntity"

@Entity()
export class PlayerMobEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @Column({ default: 0 })
  public trains: number

  @Column({ default: 0 })
  public practices: number

  @Column({ default: 0 })
  public hunger: number

  @Column({ default: 0 })
  public appetite: number

  @OneToOne(() => MobEntity, mob => mob.playerMob)
  @JoinColumn()
  public mob: MobEntity

  @OneToOne(() => Attributes, { eager: true, cascade: true })
  @JoinColumn()
  public trainedAttributes: Attributes

  @OneToOne(() => MobEntity)
  @JoinColumn()
  public lastTell: MobEntity

  @Column({ default: 0 })
  public experience: number

  @Column({ default: 0 })
  public experienceToLevel: number

  @Column({ default: 0 })
  public experiencePerLevel: number

  @Column("text")
  public standing: Standing = Standing.Good

  @Column("integer")
  public authorizationLevel: AuthorizationLevel = AuthorizationLevel.Mortal

  @Column({ default: 0 })
  public bounty: number

  @Column({ default: "the acolyte" })
  public title: string

  @Column("json", { default: [] })
  public aliases: Aliases

  @Column({ default: true })
  public autoAssist: boolean

  @Column({ default: true })
  public autoExit: boolean

  @Column({ default: true })
  public autoList: boolean

  @Column({ default: true })
  public autoLoot: boolean

  @Column({ default: true })
  public autoSac: boolean

  @Column({ default: true })
  public autoSplit: boolean

  public customizations: Customization[] = []

  public getAliasCommand(alias: string) {
    return Maybe.if(this.aliases.find(a => a.alias === alias), a => a.command).get()
  }

  public getCreationPoints(): number {
    return this.customizations.reduce(
      (previous: number, current: Customization) => previous + current.getCreationPoints(), 0)
  }

  public regen(): void {
    this.hunger--
    this.normalizeVitals()
  }

  public eat(item: ItemEntity) {
    this.hunger += item.hunger
    item.affects.forEach((affect) => this.mob.affect().add(affect))
    this.normalizeVitals()
  }

  public isHungry(): boolean {
    return this.hunger === 0
  }

  public addExperience(amount: number) {
    if (this.experienceToLevel > 0) {
      this.experience += amount
      this.experienceToLevel -= amount
    }
  }

  private normalizeVitals(): void {
    if (this.hunger < 0) {
      this.hunger = 0
    } else if (this.hunger > this.appetite) {
      this.hunger = this.appetite
    }
  }
}
