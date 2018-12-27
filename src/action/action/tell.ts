import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"
import {Channel} from "../../client/channel"
import SocialEvent from "../../client/event/socialEvent"
import GameService from "../../gameService/gameService"
import Response from "../../request/response"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const request = checkedRequest.request
  const message = request.getContextAsInput().message
  await service.publishEvent(new SocialEvent(
    checkedRequest.mob,
    Channel.Tell,
    `${checkedRequest.mob.name} tells you, "${message}"`,
    checkedRequest.getCheckTypeResult(CheckType.HasTarget)))

  return request.respondWith().success(`You tell ${request.mob.name}, "${message}"`)
}
