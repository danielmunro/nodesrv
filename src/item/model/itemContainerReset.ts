import { Entity, JoinColumn, OneToOne } from "typeorm"
import { Item } from "./item"
import ItemReset from "./itemReset"

@Entity()
export class ItemContainerReset extends ItemReset {
  @OneToOne(type => Item, { eager: true })
  @JoinColumn()
  public itemDestination: Item
}
