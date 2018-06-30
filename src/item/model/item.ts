import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Affect } from "../../affect/model/affect"
import { newEmptyAttributes } from "../../attributes/factory"
import Attributes from "../../attributes/model/attributes"
import { Equipment } from "../equipment"
import { Inventory } from "./inventory"

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public name: string

  @Column("text")
  public description: string

  @Column("text")
  public equipment: Equipment

  @Column("integer")
  public value: number = 0

  @ManyToOne((type) => Inventory, (inventory) => inventory.items)
  public inventory: Inventory

  @OneToOne((type) => Attributes, (attributes) => attributes.item)
  public attributes: Attributes = newEmptyAttributes()

  @OneToMany((type) => Affect, (affect) => affect.item)
  public affects: Affect[] = []

  public matches(subject: string): boolean {
    const words = this.name.split(" ")
    return words.find((word) =>
      word.startsWith(subject)) ? true : false
  }
}
