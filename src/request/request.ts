import { Client } from "../client/client"
import { Item } from "../item/model/item"
import { Mob } from "../mob/model/mob"
import { Player } from "../player/model/player"
import { Room } from "../room/model/room"
import { default as AuthRequest } from "../session/auth/request"
import { RequestType } from "./requestType"
import RequestBuilder from "./requestBuilder"

export function getNewRequestFromMessageEvent(client: Client, messageEvent: MessageEvent): Request | AuthRequest {
  const data = JSON.parse(messageEvent.data)
  if (!client.player) {
    return new AuthRequest(client, data.request)
  }
  const requestArgs = data.request.split(" ")
  const requestBuilder = new RequestBuilder(client.player, client.getMobTable())
  return requestBuilder.create(requestArgs[0], data.request)
}

export class Request {
  public readonly command: string
  public readonly subject: string
  public readonly message: string
  public readonly mob: Mob

  constructor(
    public readonly player: Player,
    public readonly requestType: RequestType,
    public readonly input: string = requestType.toString(),
    private readonly target: Mob = null) {
    const words = input.split(" ")
    this.command = words[0]
    this.subject = words[1]
    this.message = words.slice(1).join(" ")
    this.mob = this.player.sessionMob
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

  public getTarget(): Mob | null {
    return this.target
  }

  public getPrompt(): string {
    return this.player.prompt()
  }
}
