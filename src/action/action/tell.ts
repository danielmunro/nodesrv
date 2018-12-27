import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"
import {Channel} from "../../client/channel"
import SocialEvent from "../../client/event/socialEvent"
import GameService from "../../gameService/gameService"
import Response from "../../request/response"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const request = checkedRequest.request
  const message = request.getContextAsInput().words.slice(2).join(" ")
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
  await service.publishEvent(new SocialEvent(
    checkedRequest.mob,
    Channel.Tell,
    `${checkedRequest.mob.name} tells you, "${message}"`,
    target))

  return request.respondWith().success(`You tell ${target.name}, "${message}"`)
}
