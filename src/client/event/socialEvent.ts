import Event from "../../event/event"
import {EventType} from "../../event/eventType"
import {Mob} from "../../mob/model/mob"
import {Channel} from "../channel"

export default class SocialEvent implements Event {
  constructor(
    public readonly mob: Mob,
    public readonly channel: Channel,
    public readonly message: string,
    public readonly toMob: Mob = null) {}

  public getEventType(): EventType {
    return EventType.Social
  }
}
