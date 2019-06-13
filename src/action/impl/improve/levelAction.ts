import Check from "../../../check/check"
import {CheckMessages} from "../../../check/constants"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import MobService from "../../../mob/service/mobService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class LevelAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly mobService: MobService) {
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
    const levelService = this.mobService.createLevelServiceForMob(request.mob)
    return this.checkBuilderFactory
      .createCheckBuilder(request)
      .require(levelService.canMobLevel(), CheckMessages.NotEnoughExperience)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    await this.mobService.createLevelServiceForMob(requestService.getMob()).gainLevel()
    return requestService.respondWith().success(Messages.Level.Success)
  }
}
