import { Entity, JoinColumn, OneToOne } from "typeorm"
import { Mob } from "../../mob/model/mob"
import ItemReset from "./itemReset"

@Entity()
export default class ItemMobReset extends ItemReset {
  @OneToOne(() => Mob, { eager: true })
  @JoinColumn()
  public mob: Mob
}
