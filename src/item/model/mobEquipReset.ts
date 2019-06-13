import {Entity, JoinColumn, ManyToOne} from "typeorm"
import { MobEntity } from "../../mob/entity/mobEntity"
import ItemReset from "./itemReset"

@Entity()
export class MobEquipReset extends ItemReset {
  @ManyToOne(() => MobEntity, { eager: true })
  @JoinColumn()
  public mob: MobEntity
}
