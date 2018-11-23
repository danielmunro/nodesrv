import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { default as Attributes } from "../../attributes/model/attributes"
import { Item } from "../../item/model/item"
import { AuthorizationLevel } from "../../player/authorizationLevel"
import { Standing } from "../enum/standing"
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

  @OneToOne((type) => Mob, (mob) => mob.playerMob)
  @JoinColumn()
  public mob: Mob

  @OneToOne((type) => Attributes)
  @JoinColumn()
  public trainedAttributes: Attributes = new Attributes()

  @Column("integer")
  public experience: number = 0

  @Column("integer")
  public experienceToLevel: number = 0

  @Column("varchar")
  public standing: Standing = Standing.Good

  @Column("integer")
  public authorizationLevel: AuthorizationLevel = AuthorizationLevel.Mortal

  public regen(): void {
    this.hunger--
    this.normalizeVitals()
  }

  public eat(item: Item) {
    this.hunger += item.nourishment
    item.affects.forEach((affect) => this.mob.addAffect(affect))
    this.normalizeVitals()
  }

  public isHungry(): boolean {
    return this.hunger === 0
  }

  private normalizeVitals(): void {
    if (this.hunger < 0) {
      this.hunger = 0
    } else if (this.hunger > this.appetite) {
      this.hunger = this.appetite
    }
  }
}
