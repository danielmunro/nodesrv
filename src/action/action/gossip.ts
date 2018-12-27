import CheckedRequest from "../../check/checkedRequest"
import {Channel} from "../../client/channel"
import SocialEvent from "../../client/event/socialEvent"
import GameService from "../../gameService/gameService"
import Response from "../../request/response"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const request = checkedRequest.request
  const message = request.getContextAsInput().message
  await service.publishEvent(new SocialEvent(
    request.mob,
    Channel.Gossip,
    `${request.mob.name} gossips, "${message}"`))
  return request.respondWith().info(`You gossip, "${message}"`)
}
