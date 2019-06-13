import {Entity, JoinColumn, ManyToOne} from "typeorm"
import { MobEntity } from "../../mob/entity/mobEntity"
import ItemReset from "./itemReset"

@Entity()
export default class ItemMobReset extends ItemReset {
  @ManyToOne(() => MobEntity, { eager: true })
  @JoinColumn()
  public mob: MobEntity
}
