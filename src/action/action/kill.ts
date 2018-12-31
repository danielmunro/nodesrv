import CheckedRequest from "../../check/checkedRequest"
import {EventType} from "../../event/eventType"
import GameService from "../../gameService/gameService"
import MobEvent from "../../mob/event/mobEvent"
import Response from "../../request/response"
import { Messages } from "./constants"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const request = checkedRequest.request
  await service.publishEvent(new MobEvent(EventType.Attack, request.mob, request.getTarget()))

  return checkedRequest.respondWith().success(
    Messages.Kill.Success,
    { screamVerb: "scream", attackVerb: "attack", target: request.getTarget() },
    { screamVerb: "screams", attackVerb: "attacks", target: "you" },
  { screamVerb: "screams", attackVerb: "attacks", target: request.getTarget() })
}
