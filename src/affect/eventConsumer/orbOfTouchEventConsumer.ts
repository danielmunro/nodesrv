import { injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {MobInteractionEvent} from "../../event/type/mobInteractionEvent"
import ResponseMessageBuilder from "../../messageExchange/builder/responseMessageBuilder"
import {AffectMessages} from "../constants"
import {AffectType} from "../enum/affectType"

@injectable()
export default class OrbOfTouchEventConsumer implements EventConsumer {
  public async isEventConsumable(event: MobInteractionEvent): Promise<boolean> {
    return event.target.affect().has(AffectType.OrbOfTouch)
  }

  public async consume(event: MobInteractionEvent): Promise<EventResponse> {
    event.target.affect().remove(AffectType.OrbOfTouch)
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

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Attack, EventType.Touch ]
  }
}
