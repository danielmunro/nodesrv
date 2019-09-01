import { injectable } from "inversify"
import InputEvent from "../../client/event/inputEvent"
import {EventType} from "../../event/enum/eventType"
import {createInputEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {RequestType} from "../../messageExchange/enum/requestType"
import {ResponseStatus} from "../../messageExchange/enum/responseStatus"
import Response from "../../messageExchange/response"
import ResponseMessage from "../../messageExchange/responseMessage"
import {SpellMessages} from "../../mob/spell/constants"
import {AffectType} from "../enum/affectType"

@injectable()
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
