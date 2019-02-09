import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import SocialService from "../../../gameService/socialService"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"

export default class SayAction extends Action {
  constructor(
    private readonly socialService: SocialService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.socialService.createSocialCheck(request)
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    await this.socialService.say(checkedRequest)
    const request = checkedRequest.request
    return request.respondWith().success(`You said, "${request.getContextAsInput().message}"`)
  }

  protected getRequestType(): RequestType {
    return RequestType.Say
  }
}
