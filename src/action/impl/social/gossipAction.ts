import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import SocialService from "../../../gameService/socialService"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {ActionPart} from "../../enum/actionPart"

export default class GossipAction extends Action {
  constructor(
    private readonly socialService: SocialService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.socialService.createSocialCheck(request)
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    await this.socialService.gossip(checkedRequest)
    return checkedRequest.respondWith()
      .info(`You gossip, "${checkedRequest.request.getContextAsInput().message}"`)
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Freeform]
  }

  protected getRequestType(): RequestType {
    return RequestType.Gossip
  }
}
