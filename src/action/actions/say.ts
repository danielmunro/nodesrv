import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import { Channel } from "../../social/channel"
import { broadcastPrivateMessage } from "../../social/privateBroadcast"

export default function(request: Request): Promise<Response> {
  broadcastPrivateMessage(
    request.getRoom().uuid,
    request.player,
    Channel.Say,
    `${request.mob.name} says, "${request.message}"`,
  )

  return request.respondWith().success(`You said, "${request.message}"`)
}
