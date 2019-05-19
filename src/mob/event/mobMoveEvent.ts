import Event from "../../event/event"
import {Direction} from "../../room/constants"
import {Room} from "../../room/model/room"
import {Mob} from "../model/mob"

export default interface MobMoveEvent extends Event {
  readonly mob: Mob
  readonly source: Room
  readonly destination: Room
  readonly direction?: Direction
}
