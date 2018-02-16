import { RequestType } from "./../handler/constants"
import { HandlerDefinition } from "./../handler/handlerDefinition"
import { Player } from "../../player/player"

export function getNewRequestFromMessageEvent(player: Player, messageEvent: MessageEvent): Request {
  const message = JSON.parse(messageEvent.data)

  return new Request(player, message.request, message)
}

export class Request {
  public readonly player: Player
  public readonly requestType: RequestType
  public readonly args

  constructor(player: Player, requestType: RequestType, args = {}) {
    this.player = player
    this.requestType = requestType
    this.args = args
  }
}
