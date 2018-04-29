import { RequestType } from "../../handler/constants"
import { Item } from "../../item/model/item"
import match from "../../matcher/match"
import { Mob } from "../../mob/model/mob"
import { Player } from "../../player/model/player"
import { Room } from "../../room/model/room"

export function createRequestArgs(request: string) {
  return { request }
}

export function getNewRequestFromMessageEvent(player: Player, messageEvent: MessageEvent): Request {
  const data = JSON.parse(messageEvent.data)
  const requestArgs = data.request.split(" ")

  return new Request(player, requestArgs[0], data)
}

export class Request {
  public readonly player: Player
  public readonly requestType: RequestType
  public readonly args
  public readonly command: string
  public readonly subject: string
  public readonly message: string
  public readonly target: Mob | null = null

  constructor(player: Player, requestType: RequestType, args = {}) {
    this.player = player
    this.requestType = requestType
    this.args = args
    if (this.args.request) {
      const r = this.args.request.split(" ")
      this.command = r[0]
      this.subject = r[1]
      const find = r[r.length - 1]
      this.target = this.getRoom().mobs.find((m) => match(m.name, find))
      this.message = r.slice(1).join(" ")
    }
  }

  public getRoom(): Room {
    return this.player.sessionMob.room
  }

  public findItemInSessionMobInventory(): Item | undefined {
    return this.player.sessionMob.inventory.findItemByName(this.subject)
  }

  public findItemInRoomInventory(): Item | undefined {
    return this.player.sessionMob.room.inventory.findItemByName(this.subject)
  }

  public findMobInRoom(): Mob | undefined {
    return this.player.sessionMob.room.findMobByName(this.subject)
  }

  public getTarget(): Mob | undefined {
    return this.target
  }
}
