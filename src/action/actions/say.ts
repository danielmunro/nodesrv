import { Request } from "../../request/request"
import Response from "../../request/response"
import { Channel } from "../../social/channel"
import { broadcastPrivateMessage } from "../../social/privateBroadcast"

export default function(request: Request): Promise<Response> {
  broadcastPrivateMessage(
    request.getRoom().uuid,
    request.mob,
    Channel.Say,
    `${request.mob.name} says, "${request.getContextAsInput().message}"`)

  return request.respondWith().success(`You said, "${request.getContextAsInput().message}"`)
}
