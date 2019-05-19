import Event from "../../event/event"
import {Item} from "../../item/model/item"
import {Mob} from "../model/mob"

export default interface ItemDroppedEvent extends Event {
  readonly mob: Mob
  readonly item: Item
}
