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
import InputContext from "./context/inputContext"
import RequestContext from "./context/requestContext"
import RequestBuilder from "./requestBuilder"
import { RequestType } from "./requestType"
import ResponseAction from "./responseAction"
import ResponseBuilder from "./responseBuilder"

export function getNewRequestFromMessageEvent(
  client: Client, room: Room, messageEvent: MessageEvent): Request | AuthRequest {
  const data = JSON.parse(messageEvent.data)
  if (!client.player) {
    return new AuthRequest(client, data.request)
  }
  const requestArgs = data.request.split(" ")
  const mob = client.player.sessionMob
  const requestBuilder = new RequestBuilder(mob, room, client.getMobTable())
  return requestBuilder.create(requestArgs[0], data.request)
}

export class Request {
  constructor(
    public readonly mob: Mob,
    public readonly room: Room,
    public readonly context: RequestContext,
    private readonly target: Mob | Item = null) {}

  public getContextAsInput(): InputContext {
    return this.context as InputContext
  }

  public getType(): RequestType {
    return this.context.getRequestType()
  }

  public getRoom(): Room {
    return this.room
  }

  public findItemInSessionMobInventory(item = this.getContextAsInput().subject): Item | undefined {
    return this.mob.inventory.findItemByName(item)
  }

  public findItemInRoomInventory(item = this.getContextAsInput().subject): Item | undefined {
    return this.room.inventory.findItemByName(item)
  }

  public findMobInRoom(): Mob | undefined {
    return this.room.findMobByName(this.getContextAsInput().subject)
  }

  public getTarget(): Mob | Item | null {
    return this.target
  }

  public getSubject(): string {
    return this.getContextAsInput().subject
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
