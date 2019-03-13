import Event from "../../event/event"
import {EventType} from "../../event/eventType"
import ResponseMessage from "../../request/responseMessage"
import {Room} from "../model/room"

export default class RoomMessageEvent implements Event {
  constructor(
    public readonly room: Room,
    public readonly message: ResponseMessage) {}

  public getEventType(): EventType {
    return EventType.RoomMessage
  }
}
