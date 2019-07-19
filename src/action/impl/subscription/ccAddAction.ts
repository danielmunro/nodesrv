import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import PlayerService from "../../../player/service/playerService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {HelpMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class CcAddAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly playerService: PlayerService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ShortName, ActionPart.CCNumber, ActionPart.ExpMonth, ActionPart.ExpYear ]
  }

  public getHelpText(): string {
    return HelpMessages.CcAdd
  }

  public getRequestType(): RequestType {
    return RequestType.CCAdd
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const words = requestService.getRequest().getContextAsInput().words
    const nickname = words[1]
    const ccNumber = words[2]
    const expMonth = parseInt(words[3], 10)
    const expYear = parseInt(words[4], 10)
    try {
      await this.playerService.addPaymentMethod(mob, nickname, ccNumber, expMonth, expYear)
      return requestService.respondWith().success("payment method added")
    } catch (error) {
      return requestService.respondWith().fail(error.message)
    }
  }
}
