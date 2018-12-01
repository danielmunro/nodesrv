import { Entity, JoinColumn, OneToOne } from "typeorm"
import { Mob } from "../../mob/model/mob"
import ItemReset from "./itemReset"

@Entity()
export class MobEquipReset extends ItemReset {
  @OneToOne(type => Mob, { eager: true })
  @JoinColumn()
  public mob: Mob
}
