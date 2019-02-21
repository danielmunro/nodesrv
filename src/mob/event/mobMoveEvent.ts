import Event from "../../event/event"
import {EventType} from "../../event/eventType"
import {Room} from "../../room/model/room"
import {Mob} from "../model/mob"
import {Direction} from "../../room/constants"

export default class MobMoveEvent implements Event {
  constructor(
    public readonly mob: Mob,
    public readonly source: Room,
    public readonly destination: Room,
    public readonly direction: Direction) {}

  public getEventType(): EventType {
    return EventType.MobMoved
  }
}
