import Event from "../../event/event"
import ResponseMessage from "../../request/responseMessage"
import {RoomEntity} from "../entity/roomEntity"

export default interface RoomMessageEvent extends Event {
  readonly room: RoomEntity
  readonly message: ResponseMessage
}
