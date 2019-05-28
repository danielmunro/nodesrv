import {Entity, JoinColumn, ManyToOne} from "typeorm"
import { Item } from "./item"
import ItemReset from "./itemReset"

@Entity()
export class ItemContainerReset extends ItemReset {
  @ManyToOne(() => Item)
  @JoinColumn()
  public itemDestination: Item
}
