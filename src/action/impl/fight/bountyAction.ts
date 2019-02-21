import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import MobService from "../../../mob/mobService"
import {Mob} from "../../../mob/model/mob"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class BountyAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const mob = this.mobService.mobTable.find((m: Mob) => m.name === request.getSubject())
    return this.checkBuilderFactory
      .createCheckBuilder(request)
      .requirePlayer(mob)
      .require(
        request.getComponent(),
        Messages.Bounty.NeedAmount,
        CheckType.HasArguments)
      .require(
        (amount: number) => request.mob.gold >= amount,
        Messages.Bounty.NeedMoreGold)
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.PlayerMob, ActionPart.Number]
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.Bounty
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const [ mob, amount ] = checkedRequest.results(CheckType.IsPlayer, CheckType.HasArguments)
    checkedRequest.mob.gold -= amount
    mob.playerMob.bounty += parseInt(amount, 10)

    return checkedRequest.respondWith().success(Messages.Bounty.Success)
  }
}
