import CheckedRequest from "../../check/checkedRequest"
import MobEvent from "../../event/event/mobEvent"
import {EventType} from "../../event/eventType"
import GameService from "../../gameService/gameService"
import Response from "../../request/response"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const request = checkedRequest.request
  const message = request.getContextAsInput().message
  await service.publishEvent(new MobEvent(
    EventType.Social,
    request.mob,
    request.mob.name + " gossips, \"" + message + "\""))
  return request.respondWith().info("You gossip, '" + message + "'")
}
