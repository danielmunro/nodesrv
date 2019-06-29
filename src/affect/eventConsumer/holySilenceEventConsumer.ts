import InputEvent from "../../client/event/inputEvent"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {createInputEvent} from "../../event/factory/eventFactory"
import {SpellMessages} from "../../mob/spell/constants"
import {RequestType} from "../../request/enum/requestType"
import {ResponseStatus} from "../../request/enum/responseStatus"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import {AffectType} from "../enum/affectType"

export default class HolySilenceEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [ EventType.ClientRequest ]
  }

  public async consume(event: InputEvent): Promise<EventResponse> {
    const request = event.request
    if (event.mob.affect().has(AffectType.HolySilence) && request.getType() === RequestType.Cast) {
      return EventResponse.satisfied(
        createInputEvent(
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
