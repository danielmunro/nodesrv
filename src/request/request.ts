import { Item } from "../item/model/item"
import match from "../matcher/match"
import { Mob } from "../mob/model/mob"
import { Player } from "../player/model/player"
import { Room } from "../room/model/room"
import { RequestType } from "./requestType"

// @todo refactor out usages
export function createRequestArgs(input: string) {
  return input
}

export function getNewRequestFromMessageEvent(player: Player, messageEvent: MessageEvent): Request {
  const data = JSON.parse(messageEvent.data)
  const requestArgs = data.request.split(" ")

  return new Request(player, requestArgs[0], data.request)
}

export class Request {
  public readonly command: string
  public readonly subject: string
  public readonly message: string
  public readonly mob: Mob
  public readonly target: Mob | null = null

  constructor(
    public readonly player: Player,
    public readonly requestType: RequestType,
    public readonly args = null) {
    this.mob = this.player.sessionMob
    if (this.args) {
      const r = this.args.split(" ")
      this.command = r[0]
      this.subject = r[1]
      this.message = r.slice(1).join(" ")
      if (player) {
        const find = r[r.length - 1]
        this.target = this.getRoom().mobs.find((m) => match(m.name, find))
      }
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
