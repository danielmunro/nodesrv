import {RoomEntity} from "../../room/entity/roomEntity"
import {Direction} from "../../room/enum/direction"
import MobEvent from "./mobEvent"

export default interface MobMoveEvent extends MobEvent {
  readonly source: RoomEntity
  readonly destination: RoomEntity
  readonly mvCost: number
  readonly direction?: Direction
}
