import Event from "../../event/event"
import {Room} from "../../room/model/room"
import {Mob} from "../model/mob"

export default interface TickEvent extends Event {
  readonly mob: Mob
  readonly room: Room
  readonly regenModifier: number
}
