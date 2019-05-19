import Event from "../../event/event"
import {Item} from "../model/item"

export default interface ItemEvent extends Event {
  readonly item: Item
  readonly carriedBy?: any
}
