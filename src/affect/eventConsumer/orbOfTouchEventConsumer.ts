import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import MobEvent from "../../mob/event/mobEvent"
import {Mob} from "../../mob/model/mob"
import ResponseMessageBuilder from "../../request/responseMessageBuilder"
import {AffectMessages} from "../constants"
import {AffectType} from "../enum/affectType"

export default class OrbOfTouchEventConsumer implements EventConsumer {
  public async consume(event: MobEvent): Promise<EventResponse> {
    const target = event.context as Mob
    const aff = target.affect()
    if (aff.has(AffectType.OrbOfTouch)) {
      aff.remove(AffectType.OrbOfTouch)
      return EventResponse.satisfied(event, new ResponseMessageBuilder(
        event.mob,
        AffectMessages.OrbOfTouch.Touched,
        target)
        .setVerbToRequestCreator("bounce")
        .setVerbToTarget("bounces")
        .setVerbToObservers("bounces")
        .setPluralizeTarget()
        .setTargetPossessive()
        .create())
    }
    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Attack, EventType.Touch ]
  }
}
