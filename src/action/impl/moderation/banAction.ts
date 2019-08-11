import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {isBanned, Standing} from "../../../mob/enum/standing"
import MobService from "../../../mob/service/mobService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import Maybe from "../../../support/functional/maybe/maybe"
import {Types} from "../../../support/types"
import {
  MESSAGE_FAIL_ALREADY_BANNED, Messages,
} from "../../constants"
import {MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import {BanCommand} from "../../enum/banCommand"
import Action from "../action"

@injectable()
export default class BanAction extends Action {
  public static getNewStandingFromBanCommand(arg: BanCommand): Standing | undefined {
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
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.MobService) private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const mob = this.mobService.mobTable.find((m: MobEntity) => m.name === request.getSubject()) as MobEntity
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireMob()
      .capture()
      .requirePlayer(mob)
      .requireSpecialAuthorization(request.getAuthorizationLevel())
      .require((m: MobEntity) => !isBanned(m.getStanding()), MESSAGE_FAIL_ALREADY_BANNED)
      .not().requireSpecialAuthorization(
        Maybe.if(mob, () => mob.getAuthorizationLevel()).get(),
        MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const target = requestService.getResult<MobEntity>()
    const newStanding = BanAction.getNewStandingFromBanCommand(
      BanAction.getBanCommand(requestService.getComponent())) as Standing
    target.playerMob.standing = newStanding

    return requestService.respondWith().success(
      `You have banned ${target.name} with a ban level: ${newStanding}.`)
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Target ]
  }

  public getRequestType(): RequestType {
    return RequestType.Ban
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
