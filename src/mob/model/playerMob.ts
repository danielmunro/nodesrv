import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Item } from "../../item/model/item"
import { Mob } from "./mob"
import appetite from "../race/appetite"
import { default as Attributes } from "../../attributes/model/attributes"

@Entity()
export class PlayerMob {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("text")
  public name: string

  @Column("integer", { default: 0 })
  public trains: number = 0

  @Column("integer", { default: 0 })
  public practices: number = 0

  @Column("integer")
  public hunger: number = 0

  @OneToOne((type) => Mob, (mob) => mob.playerMob)
  @JoinColumn()
  public mob: Mob

  @OneToOne((type) => Attributes)
  @JoinColumn()
  public trainedAttributes: Attributes = new Attributes()

  @Column("integer")
  public experience: number = 0

  public regen(): void {
    this.hunger--
    this.normalizeVitals()
  }

  public eat(item: Item) {
    this.hunger += item.nourishment
    item.affects.forEach((affect) => this.mob.addAffect(affect))
    this.mob.inventory.removeItem(item)
    this.normalizeVitals()
  }

  public isHungry(): boolean {
    return this.hunger === 0
  }

  private normalizeVitals(): void {
    const maxAppetite = appetite(this.mob.race)
    if (this.hunger < 0) {
      this.hunger = 0
    } else if (this.hunger > maxAppetite) {
      this.hunger = maxAppetite
    }
  }
}
