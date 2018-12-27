import Response from "../../request/response"
import { Channel } from "../../client/channel"
import GameService from "../../gameService/gameService"
import SocialEvent from "../../client/event/socialEvent"
import CheckedRequest from "../../check/checkedRequest"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const request = checkedRequest.request
  await service.publishEvent(new SocialEvent(
    request.mob,
    Channel.Say,
    `${request.mob.name} says, "${request.getContextAsInput().message}"`))
  return request.respondWith().success(`You said, "${request.getContextAsInput().message}"`)
}
