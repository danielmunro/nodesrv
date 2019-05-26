import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Inventory } from "./inventory"
import { Item } from "./item"
import {createInventory} from "../factory/inventoryFactory"

@Entity()
export default class Container {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("boolean")
  public isOpen: boolean = false

  @Column("boolean", { nullable: true })
  public isCloseable: boolean = false

  @Column("integer")
  public weightCapacity: number = 0

  @Column("integer")
  public itemCapacity: number = 0

  @Column("integer")
  public maxWeightForItem: number = 0

  @OneToOne(() => Inventory, { eager: true })
  @JoinColumn()
  public inventory: Inventory = createInventory()

  public addItem(item: Item, carriedBy?: any) {
    this.inventory.addItem(item)
    item.carriedBy = carriedBy
  }

  public getItemFrom(item: Item, inventory: Inventory) {
    this.inventory.getItemFrom(item, inventory)
  }

  public toString(): string {
    return this.inventory.items.reduce((previous, current) => `${previous}\n${current.name}`, "")
  }
}
