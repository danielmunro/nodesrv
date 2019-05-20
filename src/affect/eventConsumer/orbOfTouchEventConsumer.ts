import {EventType} from "../../event/enum/eventType"
import {MobInteractionEvent} from "../../event/event"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import ResponseMessageBuilder from "../../request/builder/responseMessageBuilder"
import {AffectMessages} from "../constants"
import {AffectType} from "../enum/affectType"

export default class OrbOfTouchEventConsumer implements EventConsumer {
  public async consume(event: MobInteractionEvent): Promise<EventResponse> {
    const aff = event.target.affect()
    if (aff.has(AffectType.OrbOfTouch)) {
      aff.remove(AffectType.OrbOfTouch)
      return EventResponse.satisfied(event, new ResponseMessageBuilder(
        event.mob,
        AffectMessages.OrbOfTouch.Touched,
        event.target)
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
