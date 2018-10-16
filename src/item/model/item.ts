import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
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

  @Column("boolean", { default: true })
  public isTransferable: boolean = true

  @Column("integer")
  public level: number = 0

  @ManyToOne(type => Inventory, inventory => inventory.items, { eager: true })
  public inventory: Inventory

  @OneToOne(type => Attributes, attributes => attributes.item)
  public attributes: Attributes = newEmptyAttributes()

  @OneToMany(type => Affect, affect => affect.item)
  public affects: Affect[] = []

  @OneToOne(type => Inventory, { cascadeAll: true, eager: true })
  @JoinColumn()
  public containerInventory

  public matches(subject: string): boolean {
    const words = this.name.split(" ")
    return !!words.find(word => word.startsWith(subject))
  }

  public isFood(): boolean {
    return this.itemType === ItemType.Food
  }

  public isContainer(): boolean {
    return !!this.containerInventory
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
    item.affects = this.affects.map(affect => newAffect(affect.affectType, affect.timeout))

    return item
  }

  public describe(): string {
    return this.description + (this.itemType === ItemType.Container ?
      "\n\nContainer inventory:\n" + this.containerInventory.toString() : "")
  }

  public toString(): string {
    return this.name
  }
}
