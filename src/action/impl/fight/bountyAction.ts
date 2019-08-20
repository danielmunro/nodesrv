import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class BountyAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(this.getActionParts())
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.PlayerMob, ActionPart.GoldOnHand]
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.Bounty
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getResult<MobEntity>(CheckType.IsPlayer)
    const amount = requestService.getResult<number>(CheckType.HasGold)
    requestService.subtractGold(amount)
    mob.playerMob.bounty += amount
    return requestService.respondWith().success(Messages.Bounty.Success)
  }
}
