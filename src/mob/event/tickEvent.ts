import Event from "../../event/event"
import {RoomEntity} from "../../room/entity/roomEntity"
import {Mob} from "../model/mob"

export default interface TickEvent extends Event {
  readonly mob: Mob
  readonly room: RoomEntity
  readonly regenModifier: number
}
