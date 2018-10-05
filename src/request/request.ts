import { ActionOutcome } from "../action/actionOutcome"
import { MESSAGE_FAIL_DEAD } from "../action/precondition/constants"
import CheckBuilder from "../check/checkBuilder"
import { Client } from "../client/client"
import { Item } from "../item/model/item"
import { Disposition } from "../mob/disposition"
import { Mob } from "../mob/model/mob"
import { AuthorizationLevel } from "../player/authorizationLevel"
import { Room } from "../room/model/room"
import { default as AuthRequest } from "../session/auth/request"
import { Messages } from "./constants"
import RequestBuilder from "./requestBuilder"
import { RequestType } from "./requestType"
import ResponseAction from "./responseAction"
import ResponseBuilder from "./responseBuilder"

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
  public readonly component: string
  public readonly message: string

  constructor(
    public readonly mob: Mob,
    public readonly requestType: RequestType,
    public readonly input: string = requestType.toString(),
    private readonly target: Mob = null) {
    const words = input.split(" ")
    this.command = words[0]
    this.subject = words[1]
    this.component = words[2]
    this.message = words.slice(1).join(" ")
  }

  public getRoom(): Room {
    return this.mob.room
  }

  public findItemInSessionMobInventory(item = this.subject): Item | undefined {
    return this.mob.inventory.findItemByName(item)
  }

  public findItemInRoomInventory(item = this.subject): Item | undefined {
    return this.mob.room.inventory.findItemByName(item)
  }

  public findMobInRoom(): Mob | undefined {
    return this.mob.room.findMobByName(this.subject)
  }

  public getTarget(): Mob | null {
    return this.target
  }

  public getAuthorizationLevel(): AuthorizationLevel {
    if (this.mob && this.mob.playerMob) {
      return this.mob.playerMob.authorizationLevel
    }

    return AuthorizationLevel.None
  }

  public respondWith(
    actionOutcome: ActionOutcome = ActionOutcome.None,
    thing: any = null): ResponseBuilder {
    return new ResponseBuilder(this, new ResponseAction(actionOutcome, thing))
  }

  public check(): CheckBuilder {
    return new CheckBuilder()
      .forMob(this.mob)
      .not().requireDisposition(Disposition.Dead, MESSAGE_FAIL_DEAD)
  }

  public checkWithStandingDisposition(): CheckBuilder {
    return this.check().requireDisposition(Disposition.Standing, Messages.NotStanding)
  }
}
