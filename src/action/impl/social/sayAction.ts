import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import SocialService from "../../../player/service/socialService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class SayAction extends Action {
  constructor(
    @inject(Types.SocialService) private readonly socialService: SocialService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.socialService.createSocialCheck(request, this.getActionParts())
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const message = requestService.getResult<string>(CheckType.FreeForm)
    await this.socialService.say(requestService.getMob(), message)
    return requestService.respondWith()
      .success(`You said, "${message}"`)
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
