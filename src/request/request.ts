import { Item } from "../item/model/item"
import match from "../matcher/match"
import { Mob } from "../mob/model/mob"
import { getMob } from "../mob/table"
import { Player } from "../player/model/player"
import { Room } from "../room/model/room"
import { RequestType } from "./requestType"
import { default as AuthRequest } from "../session/auth/request"
import { Client } from "../client/client"

export function getNewRequestFromMessageEvent(client: Client, messageEvent: MessageEvent): Request | AuthRequest {
  const data = JSON.parse(messageEvent.data)
  if (!client.player) {
    return new AuthRequest(client, data.request)
  }
  const requestArgs = data.request.split(" ")
  return new Request(client.player, requestArgs[0], data.request)
}

export class Request {
  public readonly command: string
  public readonly subject: string
  public readonly message: string
  public readonly mob: Mob
  private readonly target: Mob | null = null

  constructor(
    public readonly player: Player,
    public readonly requestType: RequestType,
    public readonly args: string = null) {
    this.mob = this.player.sessionMob
    if (!this.args) {
      this.args = this.requestType
    }
    const r = this.args.split(" ")
    this.command = r[0]
    this.subject = r[1]
    this.message = r.slice(1).join(" ")
    const find = r[r.length - 1]
    const target = this.mob.room.mobs.find((mob) => match(mob.name, find))
    if (target) {
      this.target = getMob(target.id)
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

  public getPrompt(): string {
    return this.player.prompt()
  }
}
