import Event from "../../event/event"
import ResponseMessage from "../../request/responseMessage"
import {Room} from "../model/room"

export default interface RoomMessageEvent extends Event {
  readonly room: Room
  readonly message: ResponseMessage
}
