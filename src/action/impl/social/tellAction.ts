import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import SocialService from "../../../gameService/socialService"
import Action from "../../action"

export default class TellAction extends Action {
  constructor(
    private readonly socialService: SocialService) {
    super()
  }

  public async check(request: Request): Promise<Check> {
    const checkBuilder = await this.socialService.getSocialCheck(request)
    checkBuilder.requireMob()
    return checkBuilder.create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    return this.socialService.tell(checkedRequest)
  }

  protected getRequestType(): RequestType {
    return RequestType.Tell
  }
}
