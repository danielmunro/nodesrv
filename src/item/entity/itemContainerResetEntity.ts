import {Entity, JoinColumn, ManyToOne} from "typeorm"
import { ItemEntity } from "./itemEntity"
import ItemResetEntity from "./itemResetEntity"

@Entity()
export class ItemContainerResetEntity extends ItemResetEntity {
  @ManyToOne(() => ItemEntity)
  @JoinColumn()
  public itemDestination: ItemEntity
}
