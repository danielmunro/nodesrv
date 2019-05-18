import InputEvent from "../../client/event/inputEvent"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {RequestType} from "../../request/requestType"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import {ResponseStatus} from "../../request/responseStatus"
import {SpellMessages} from "../../spell/constants"
import {AffectType} from "../enum/affectType"

export default class HolySilenceEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [ EventType.ClientRequest ]
  }

  public async consume(event: InputEvent): Promise<EventResponse> {
    const request = event.request
    if (event.mob.affect().has(AffectType.HolySilence) && request.getType() === RequestType.Cast) {
      return EventResponse.satisfied(
        new InputEvent(
          event.mob,
          request,
          event.action,
          new Response(
            request,
            ResponseStatus.PreconditionsFailed,
            new ResponseMessage(event.mob, SpellMessages.HolySilence.CastPrevented))))
    }
    return EventResponse.none(event)
  }
}
