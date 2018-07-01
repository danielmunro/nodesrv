import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import { Channel } from "../../social/channel"
import { broadcastPrivateMessage } from "../../social/chat"

export default function(request: Request): Promise<Response> {
  broadcastPrivateMessage(
    request.getRoom().uuid,
    request.player,
    Channel.Say,
    `${request.player.sessionMob.name} says, "${request.message}"`,
  )

  return new ResponseBuilder(request).success(`You said, "${request.message}"`)
}
