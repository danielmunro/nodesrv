import Event from "../../event/interface/event"
import {RoomEntity} from "../../room/entity/roomEntity"
import {MobEntity} from "../entity/mobEntity"

export default interface TickEvent extends Event {
  readonly mob: MobEntity
  readonly room: RoomEntity
  readonly regenModifier: number
}
