import {ItemEntity} from "../../item/entity/itemEntity"
import MobEvent from "./mobEvent"

export default interface ItemDroppedEvent extends MobEvent {
  readonly item: ItemEntity
}
