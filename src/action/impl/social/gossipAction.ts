import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import SocialService from "../../../gameService/socialService"
import Action from "../../action"

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

  protected getRequestType(): RequestType {
    return RequestType.Gossip
  }
}
