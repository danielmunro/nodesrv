import Event from "../../event/event"
import {ItemEntity} from "../entity/itemEntity"

export default interface ItemEvent extends Event {
  readonly item: ItemEntity
  readonly carriedBy?: any
}
