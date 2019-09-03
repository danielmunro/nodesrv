import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckMessages} from "../../../check/constants"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import MobService from "../../../mob/service/mobService"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import SimpleAction from "../simpleAction"

@injectable()
export default class LevelAction extends SimpleAction {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.MobService) private readonly mobService: MobService) {
    super(checkBuilderFactory, RequestType.Level)
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
