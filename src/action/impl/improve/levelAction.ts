import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {CheckMessages} from "../../../check/constants"
import LevelService from "../../../player/service/levelService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class LevelAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public getRequestType(): RequestType {
    return RequestType.Level
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public check(request: Request): Promise<Check> {
    const levelService = new LevelService(request.mob)
    return this.checkBuilderFactory
      .createCheckBuilder(request)
      .require(levelService.canMobLevel(), CheckMessages.NotEnoughExperience)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    new LevelService(requestService.getMob()).gainLevel()
    return requestService.respondWith().success(Messages.Level.Success)
  }
}
