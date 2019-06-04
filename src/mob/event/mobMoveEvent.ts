import {Direction} from "../../room/enum/direction"
import {Room} from "../../room/model/room"
import MobEvent from "./mobEvent"

export default interface MobMoveEvent extends MobEvent {
  readonly source: Room
  readonly destination: Room
  readonly mvCost: number
  readonly direction?: Direction
}
