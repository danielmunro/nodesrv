import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import PlayerService from "../../../player/service/playerService"
import {Types} from "../../../support/types"
import {HelpMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class CcRemoveAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.PlayerService) private readonly playerService: PlayerService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ShortName ]
  }

  public getHelpText(): string {
    return HelpMessages.CcRemove
  }

  public getRequestType(): RequestType {
    return RequestType.CCRemove
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    try {
      await this.playerService.removePaymentMethod(mob, requestService.getSubject())
      return requestService.respondWith().success("Payment method removed.")
    } catch (error) {
      return requestService.respondWith().fail(error.message)
    }
  }
}
