import Event from "../../event/interface/event"
import ResponseMessage from "../../messageExchange/responseMessage"
import {RoomEntity} from "../entity/roomEntity"

export default interface RoomMessageEvent extends Event {
  readonly room: RoomEntity
  readonly message: ResponseMessage
}
