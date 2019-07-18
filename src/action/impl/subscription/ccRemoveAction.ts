import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import PlayerService from "../../../player/service/playerService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class CcRemoveAction extends Action {
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
    return [ ActionPart.Action ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
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
