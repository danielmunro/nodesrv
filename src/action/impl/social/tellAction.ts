import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import SocialService from "../../../gameService/socialService"
import Request from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

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

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Target, ActionPart.FreeForm]
  }

  public getRequestType(): RequestType {
    return RequestType.Tell
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
