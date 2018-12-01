import { Entity, JoinColumn, OneToOne } from "typeorm"
import ItemReset from "./itemReset"
import { Mob } from "../../mob/model/mob"

@Entity()
export class MobEquipReset extends ItemReset {
  @OneToOne(type => Mob, { eager: true })
  @JoinColumn()
  public mob: Mob
}
