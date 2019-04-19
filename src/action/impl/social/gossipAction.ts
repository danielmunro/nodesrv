import Check from "../../../check/check"
import SocialService from "../../../gameService/socialService"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class GossipAction extends Action {
  constructor(private readonly socialService: SocialService) {
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
