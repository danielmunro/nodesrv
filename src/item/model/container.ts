import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Inventory } from "./inventory"
import * as v4 from "uuid"
import { Item } from "./item"

@Entity()
export default class Container {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("boolean")
  public isOpen: boolean = false

  @Column("integer")
  public weightCapacity: number = 0

  @Column("integer")
  public itemCapacity: number = 0

  @OneToOne(type => Inventory)
  @JoinColumn()
  public inventory: Inventory = new Inventory()

  public addItem(item: Item) {
    this.inventory.addItem(item)
  }

  public getItemFrom(item: Item, inventory: Inventory) {
    this.inventory.getItemFrom(item, inventory)
  }
}
