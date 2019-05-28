import {Entity, JoinColumn, ManyToOne} from "typeorm"
import { Mob } from "../../mob/model/mob"
import ItemReset from "./itemReset"

@Entity()
export class MobEquipReset extends ItemReset {
  @ManyToOne(() => Mob)
  @JoinColumn()
  public mob: Mob
}
