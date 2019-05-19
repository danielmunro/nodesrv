import AttackEvent from "../mob/event/attackEvent"
import TouchEvent from "../mob/event/touchEvent"
import {EventType} from "./enum/eventType"

export default interface Event {
  readonly eventType: EventType
}

export type MobInteractionEvent = AttackEvent | TouchEvent
