import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import MobService from "../../../mob/service/mobService"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import SimpleAction from "../simpleAction"

@injectable()
export default class NoFollowAction extends SimpleAction {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.MobService) private readonly mobService: MobService) {
    super(checkBuilderFactory, RequestType.NoFollow)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const allowingFollow = requestService.setAllowFollow()
    const verb = allowingFollow ? "are" : "are no longer"
    this.mobService.removeFollowers(requestService.getMob())
    return requestService.respondWith().success(
      Messages.NoFollow.Success,
      { verb },
      { verb },
      { verb })
  }
}
