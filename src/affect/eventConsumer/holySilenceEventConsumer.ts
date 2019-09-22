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

  public async isEventConsumable(event: InputEvent): Promise<boolean> {
    return event.mob.affect().has(AffectType.HolySilence) && event.request.getType() === RequestType.Cast
  }

  public async consume(event: InputEvent): Promise<EventResponse> {
    return EventResponse.satisfied(
      createInputEvent(
        event.request,
        event.action,
        new Response(
          event.request,
          ResponseStatus.PreconditionsFailed,
          new ResponseMessage(event.mob, SpellMessages.HolySilence.CastPrevented))))
  }
}
