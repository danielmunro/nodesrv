import { RequestType } from "./../handler/constants"
import { HandlerDefinition } from "./../handler/handlerDefinition"
import { Player } from "../../player/model/player"
import { Room } from "../../room/model/room"

export function getNewRequestFromMessageEvent(player: Player, messageEvent: MessageEvent): Request {
  const data = JSON.parse(messageEvent.data)
  const requestArgs = data.request.split(" ")

  return new Request(player, requestArgs[0], data)
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

  getRoom(): Room {
    return this.player.sessionMob.room
  }
}
