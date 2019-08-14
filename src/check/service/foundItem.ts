import {ItemEntity} from "../../item/entity/itemEntity"
import {MobEntity} from "../../mob/entity/mobEntity"

export default interface FoundItem {
  readonly item: ItemEntity
  readonly mobs: MobEntity[]
}
