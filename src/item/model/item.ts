import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { newAffect } from "../../affect/factory"
import { Affect } from "../../affect/model/affect"
import { newEmptyAttributes } from "../../attributes/factory"
import Attributes from "../../attributes/model/attributes"
import { Equipment } from "../equipment"
import { ItemType } from "../itemType"
import { Inventory } from "./inventory"

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public name: string

  @Column("text")
  public description: string

  @Column("text", { nullable: true })
  public equipment: Equipment

  @Column("integer")
  public itemType: ItemType

  @Column("integer")
  public value: number = 0

  @Column("integer")
  public nourishment: number = 0

  @ManyToOne((type) => Inventory, (inventory) => inventory.items)
  public inventory: Inventory

  @OneToOne((type) => Attributes, (attributes) => attributes.item)
  public attributes: Attributes = newEmptyAttributes()

  @OneToMany((type) => Affect, (affect) => affect.item)
  public affects: Affect[] = []

  public matches(subject: string): boolean {
    const words = this.name.split(" ")
    return !!words.find((word) => word.startsWith(subject))
  }

  public isFood(): boolean {
    return this.itemType === ItemType.Food
  }

  public copy(): Item {
    const item = new Item()
    item.name = this.name
    item.description = this.description
    item.equipment = this.equipment
    item.itemType = this.itemType
    item.value = this.value
    item.nourishment = this.nourishment
    item.attributes = this.attributes.copy()
    item.affects = this.affects.map((affect) => newAffect(affect.affectType, affect.timeout))

    return item
  }
}
