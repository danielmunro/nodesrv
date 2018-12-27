import CheckedRequest from "../../check/checkedRequest"
import { Channel } from "../../client/channel"
import SocialEvent from "../../client/event/socialEvent"
import GameService from "../../gameService/gameService"
import Response from "../../request/response"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const request = checkedRequest.request
  await service.publishEvent(new SocialEvent(
    request.mob,
    Channel.Say,
    `${request.mob.name} says, "${request.getContextAsInput().message}"`))
  return request.respondWith().success(`You said, "${request.getContextAsInput().message}"`)
}
