import Event from "../../event/interface/event"
import {ItemEntity} from "../../item/entity/itemEntity"
import Death from "../fight/death"

export default interface DeathEvent extends Event {
  readonly death: Death
  readonly corpse: ItemEntity
}
