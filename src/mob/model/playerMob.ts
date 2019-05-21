import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import {newEmptyAttributes} from "../../attributes/factory/attributeFactory"
import { default as Attributes } from "../../attributes/model/attributes"
import { Item } from "../../item/model/item"
import { AuthorizationLevel } from "../../player/authorizationLevel"
import { Standing } from "../enum/standing"
import Customization from "../specialization/customization"
import { Mob } from "./mob"

@Entity()
export class PlayerMob {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("integer", { default: 0 })
  public trains: number = 0

  @Column("integer", { default: 0 })
  public practices: number = 0

  @Column("integer")
  public hunger: number = 0

  @Column("integer")
  public appetite: number = 0

  @OneToOne(() => Mob, (mob) => mob.playerMob)
  @JoinColumn()
  public mob: Mob

  @OneToOne(() => Attributes)
  @JoinColumn()
  public trainedAttributes: Attributes = newEmptyAttributes()

  @Column("integer")
  public experience: number = 0

  @Column("integer")
  public experienceToLevel: number = 0

  @Column("integer")
  public experiencePerLevel: number = 0

  @Column("varchar")
  public standing: Standing = Standing.Good

  @Column("integer")
  public authorizationLevel: AuthorizationLevel = AuthorizationLevel.Mortal

  @Column("integer")
  public bounty: number = 0

  public customizations: Customization[] = []

  public getCreationPoints(): number {
    return this.customizations.reduce(
      (previous: number, current: Customization) => previous + current.getCreationPoints(), 0)
  }

  public regen(): void {
    this.hunger--
    this.normalizeVitals()
  }

  public eat(item: Item) {
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
