import {Entity, JoinColumn, ManyToOne} from "typeorm"
import { MobEntity } from "../../mob/entity/mobEntity"
import ItemResetEntity from "./itemResetEntity"

@Entity()
export class MobEquipResetEntity extends ItemResetEntity {
  @ManyToOne(() => MobEntity, { eager: true })
  @JoinColumn()
  public mob: MobEntity
}
