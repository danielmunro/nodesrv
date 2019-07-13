import {EventType} from "../../event/enum/eventType"
import Event from "../../event/interface/event"
import {MobEntity} from "../../mob/entity/mobEntity"
import {Channel} from "../enum/channel"

export default interface SocialEvent extends Event {
  readonly channel: Channel
  readonly mob: MobEntity
  readonly message: string
  readonly toMob?: MobEntity
  readonly eventType: EventType.Social
}
