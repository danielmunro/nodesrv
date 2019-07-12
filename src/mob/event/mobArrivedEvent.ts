import {RoomEntity} from "../../room/entity/roomEntity"
import {Direction} from "../../room/enum/direction"
import MobEvent from "./mobEvent"

export default interface MobArrivedEvent extends MobEvent {
  readonly room: RoomEntity
  readonly mvCost: number
  readonly direction?: Direction
}
