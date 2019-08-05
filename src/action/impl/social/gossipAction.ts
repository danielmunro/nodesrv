import {inject, injectable} from "inversify"
import Check from "../../../check/check"
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
export default class GossipAction extends Action {
  constructor(
    @inject(Types.SocialService) private readonly socialService: SocialService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.socialService.createSocialCheck(request)
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    await this.socialService.gossip(requestService.getMob(), requestService.getMessage())
    return requestService.respondWith()
      .info(`You gossip, "${requestService.getMessage()}"`)
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.FreeForm]
  }

  public getRequestType(): RequestType {
    return RequestType.Gossip
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
