import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { AffectType } from "../../affect/affectType"
import { Affect } from "../../affect/model/affect"
import { newEmptyAttributes } from "../../attributes/factory"
import Attributes from "../../attributes/model/attributes"
import { Equipment } from "../equipment"
import { ItemType } from "../itemType"
import { MaterialType } from "../material/materialType"
import Container from "./container"
import Drink from "./drink"
import Food from "./food"
import Forge from "./forge"
import { Inventory } from "./inventory"

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("text", { nullable: true })
  public canonicalId: string

  @Column("text", { nullable: true })
  public canonicalIdentifier: string

  @Column("text")
  public name: string

  @Column("text")
  public brief: string

  @Column("text")
  public description: string

  @Column("text", { nullable: true })
  public equipment: Equipment

  @Column("integer")
  public itemType: ItemType

  @Column("integer")
  public value: number = 0

  @Column("integer", { nullable: true })
  public hunger: number

  @Column("boolean", { default: true })
  public isTransferable: boolean = true

  @Column("integer")
  public level: number = 0

  @Column("integer")
  public weight: number = 0

  @Column("text")
  public material: MaterialType = MaterialType.Undefined

  @Column("integer")
  public condition: number = 1

  @Column("boolean", { default: true })
  public identified = true

  @Column("integer", { nullable: true })
  public capacity: number

  @Column("integer", { nullable: true })
  public wearTimer: number

  @ManyToOne(() => Inventory, inventory => inventory.items, { eager: true })
  public inventory: Inventory

  @OneToOne(() => Attributes, attributes => attributes.item)
  public attributes: Attributes = newEmptyAttributes()

  @OneToMany(() => Affect, affect => affect.item, { cascadeInsert: true, cascadeUpdate: true, eager: true })
  public affects: Affect[] = []

  @OneToOne(() => Container, { cascadeAll: true, eager: true })
  @JoinColumn()
  public container: Container

  @OneToOne(() => Food, food => food.item)
  @JoinColumn()
  public food: Food

  @OneToOne(() => Drink, drink => drink.item)
  @JoinColumn()
  public drink: Drink

  @OneToOne(() => Forge)
  @JoinColumn()
  public forge: Forge

  public matches(subject: string): boolean {
    const words = this.name.split(" ")
    return !!words.find(word => word.startsWith(subject))
  }

  public isFood(): boolean {
    return this.itemType === ItemType.Food
  }

  public isContainer(): boolean {
    return !!this.container
  }

  public describe(): string {
    return this.description + (this.itemType === ItemType.Container ?
      `\n\n${this.name} contents:\n${this.container.toString()}` : "")
  }

  public toString(): string {
    return this.name
  }

  public isVisible(): boolean {
    return this.affects.find(affect => affect.affectType === AffectType.Invisible) === undefined
  }
}
