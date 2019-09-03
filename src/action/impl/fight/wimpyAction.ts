import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {format} from "../../../support/string"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import SimpleAction from "../simpleAction"

@injectable()
export default class WimpyAction extends SimpleAction {
  constructor(@inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Wimpy)
  }

  public check(request: Request): Promise<Check> {
    const maxWimpy = Math.floor(request.mob.attribute().getHp() * 0.2)
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(this.getActionParts())
      .require((amount: number) => amount <= maxWimpy, format(Messages.Wimpy.TooHigh, maxWimpy))
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Amount ]
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const amount = requestService.getResult<number>(CheckType.Amount)
    mob.wimpy = amount
    return requestService.respondWith().info(format(Messages.Wimpy.Success, amount))
  }
}
