import {inject, injectable} from "inversify"
import Check from "../../../../check/check"
import {CheckType} from "../../../../check/enum/checkType"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Request from "../../../../messageExchange/request"
import Response from "../../../../messageExchange/response"
import RequestService from "../../../../messageExchange/service/requestService"
import MobService from "../../../../mob/service/mobService"
import Group from "../../../../mob/type/group"
import SocialService from "../../../../player/service/socialService"
import {Types} from "../../../../support/types"
import {Messages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import Action from "../../action"

@injectable()
export default class GroupTellAction extends Action {
  constructor(
    @inject(Types.SocialService) private readonly socialService: SocialService,
    @inject(Types.MobService) private readonly mobService: MobService) {
    super()
  }

  public getRequestType(): RequestType {
    return RequestType.GroupTell
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Directive, ActionPart.FreeForm ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const group = requestService.getResult<Group>(CheckType.HasGroup)
    const message = requestService.getResult<string>(CheckType.FreeForm)
    await Promise.all(
      group.mobs.filter(m => !m.is(mob))
        .map(m => this.socialService.groupTell(mob, m, message)))
    return requestService.respondWith().info(`You tell the group, "${message}"`)
  }

  public async check(request: Request): Promise<Check> {
    const check = await this.socialService.getSocialCheck(request, this.getActionParts())
    check.require(this.mobService.getGroupForMob(request.mob), "You're not in a group.", CheckType.HasGroup)
    return check.create()
  }
}
