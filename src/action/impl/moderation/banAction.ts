import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {isBanned, Standing} from "../../../mob/enum/standing"
import MobService from "../../../mob/mobService"
import {Mob} from "../../../mob/model/mob"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Maybe from "../../../support/functional/maybe"
import Action from "../../action"
import {
  MESSAGE_FAIL_ALREADY_BANNED, Messages,
} from "../../constants"
import {MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import {BanCommand} from "../../enum/banCommand"

export default class BanAction extends Action {
  private static getNewStanding(arg: BanCommand): Standing | undefined {
    switch (arg) {
      case BanCommand.Lift:
        return Standing.Good
      case BanCommand.Indefinite:
        return Standing.IndefiniteBan
      case BanCommand.Perma:
        return Standing.PermaBan
      case BanCommand.Cooloff:
        return Standing.Cooloff
      default:
        return undefined
    }
  }

  private static getBanCommand(subject: string): BanCommand {
    return subject ? subject as BanCommand : BanCommand.Cooloff
  }

  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const mob = this.mobService.mobTable.find((m: Mob) => m.name === request.getSubject())
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireMob()
      .capture()
      .requirePlayer(mob)
      .requireSpecialAuthorization(request.getAuthorizationLevel())
      .require((m: Mob) => !isBanned(m.getStanding()), MESSAGE_FAIL_ALREADY_BANNED)
      .not().requireSpecialAuthorization(
        Maybe.if(mob, () => mob.getAuthorizationLevel()),
        MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const request = checkedRequest.request
    const target = checkedRequest.check.result
    const newStanding = BanAction.getNewStanding(BanAction.getBanCommand(request.getComponent()))
    target.playerMob.standing = newStanding

    return request.respondWith().success(
      `You have banned ${target.name} with a ban level: ${newStanding}.`)
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Target ]
  }

  public getRequestType(): RequestType {
    return RequestType.Ban
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
