import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {EventType} from "../../../event/enum/eventType"
import {createMobEvent} from "../../../event/factory/eventFactory"
import EventService from "../../../event/service/eventService"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"
import SimpleAction from "../simpleAction"

@injectable()
export default class QuitAction extends SimpleAction {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.EventService) private readonly eventService: EventService) {
    super(checkBuilderFactory, RequestType.Quit)
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .not().requireFight(ConditionMessages.Quit.CannotQuitWhileFighting)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    await this.eventService.publish(createMobEvent(EventType.ClientLogout, requestService.getMob()))
    return requestService.respondWith().success()
  }
}
