import {EventType} from "../../event/enum/eventType"
import Event from "../../event/event"
import {Mob} from "../../mob/model/mob"
import {Channel} from "../channel"

export default interface SocialEvent extends Event {
  readonly channel: Channel
  readonly mob: Mob
  readonly message: string
  readonly toMob?: Mob
  readonly eventType: EventType.Social
}
