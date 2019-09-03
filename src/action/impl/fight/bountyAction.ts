import {inject, injectable} from "inversify"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import SimpleAction from "../simpleAction"

@injectable()
export default class BountyAction extends SimpleAction {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Bounty)
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.PlayerMob, ActionPart.GoldOnHand ]
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getResult<MobEntity>(CheckType.IsPlayer)
    const amount = requestService.getResult<number>(CheckType.HasGold)
    requestService.subtractGold(amount)
    mob.playerMob.bounty += amount
    return requestService.respondWith().success(Messages.Bounty.Success)
  }
}
