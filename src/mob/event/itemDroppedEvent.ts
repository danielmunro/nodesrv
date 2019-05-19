import {Item} from "../../item/model/item"
import MobEvent from "./mobEvent"

export default interface ItemDroppedEvent extends MobEvent {
  readonly item: Item
}
