import Check from "../../../check/check"
import SocialService from "../../../player/service/socialService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class SayAction extends Action {
  constructor(private readonly socialService: SocialService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.socialService.createSocialCheck(request)
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    await this.socialService.say(requestService.getMob(), requestService.getMessage())
    return requestService.respondWith()
      .success(`You said, "${requestService.getMessage()}"`)
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Target, ActionPart.FreeForm]
  }

  public getRequestType(): RequestType {
    return RequestType.Say
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
