import {inject, injectable} from "inversify"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {format} from "../../../support/string"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import SimpleAction from "../simpleAction"

@injectable()
export default class ConsiderAction extends SimpleAction {
  private static getMessageFromDifference(target: MobEntity, difference: number): string {
    if (difference <= -10) {
      return format(Messages.Consider.NakedAndWeaponless, target.name)
    } else if (difference <= -5) {
      return format(Messages.Consider.NoMatch, target.name)
    } else if (difference <= -2) {
      return format(Messages.Consider.EasyKill, target.name)
    } else if (difference <= 1) {
      return Messages.Consider.PerfectMatch
    } else if (difference <= 4) {
      return format(Messages.Consider.FeelLucky, target.name)
    } else if (difference <= 9) {
      return format(Messages.Consider.LaughsMercilessly, target.name)
    } else {
      return Messages.Consider.Death
    }
  }

  constructor(@inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Consider)
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.MobInRoom]
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mobInRoom = requestService.getResult<MobEntity>(CheckType.HasTarget)
    const mob = requestService.getMob()
    const difference = mobInRoom.level - mob.level
    return requestService.respondWith().success(ConsiderAction.getMessageFromDifference(mobInRoom, difference))
  }
}
