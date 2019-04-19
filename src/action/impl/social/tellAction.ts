import Check from "../../../check/check"
import {CheckType} from "../../../check/checkType"
import SocialService from "../../../gameService/socialService"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class TellAction extends Action {
  constructor(private readonly socialService: SocialService) {
    super()
  }

  public async check(request: Request): Promise<Check> {
    const checkBuilder = await this.socialService.getSocialCheck(request)
    checkBuilder.requireMob()
    return checkBuilder.create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const target = requestService.getResult(CheckType.HasTarget)
    const message = requestService.getMessageInTell()
    await this.socialService.tell(
      requestService.getMob(),
      target,
      message)
    return requestService.respondWith()
      .success(`You tell ${target.name}, "${message}"`)
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
