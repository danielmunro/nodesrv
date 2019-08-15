import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import MobService from "../../../mob/service/mobService"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class GroupAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.MobService) private readonly mobService: MobService) {
    super()
  }

  public getRequestType(): RequestType {
    return RequestType.Group
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.MobInRoom ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const target = requestService.getResult<MobEntity>(CheckType.HasTarget)
    const group = this.mobService.getGroupForMob(requestService.getMob())
    const follow = this.mobService.getFollowers(requestService.getMob())

    if (!follow || !follow.find(f => f.is(target))) {
      return requestService.respondWith().error("They are not following you.")
    }

    if (!group && !follow) {
      return requestService.respondWith().error("They are not following you.")
    }

    const targetGroup = this.mobService.getGroupForMob(target)

    if (targetGroup) {
      return requestService.respondWith().error("They are already part of another group.")
    }

    if (group) {
      group.mobs.push(target)
      return requestService.respondWith().success(
        "{requestCreator} {verb} {target} to {pronoun} group.",
        {verb: "add", target, pronoun: "your"},
        {verb: "adds", target: "you", pronoun: "their"},
        {verb: "adds", target, pronoun: "their"})
    }

    this.mobService.addGroup([ requestService.getMob(), target ])
    return requestService.respondWith().success(
      "{requestCreator} {verb} a new group with {target}.",
      { target, verb: "start"},
      { target: "you", verb: "starts"},
      {target, verb: "starts"})
  }

  public async check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
      .create()
  }
}
