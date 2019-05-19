import {Direction} from "../../room/constants"
import {Room} from "../../room/model/room"
import MobEvent from "./mobEvent"

export default interface MobMoveEvent extends MobEvent {
  readonly source: Room
  readonly destination: Room
  readonly direction?: Direction
}
