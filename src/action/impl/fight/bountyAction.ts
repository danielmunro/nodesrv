import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class BountyAction extends Action {
  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
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

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const [ mob, amount ] = checkedRequest.results(CheckType.IsPlayer, CheckType.HasArguments)
    checkedRequest.mob.gold -= amount
    mob.playerMob.bounty += parseInt(amount, 10)

    return checkedRequest.respondWith().success(Messages.Bounty.Success)
  }
}
