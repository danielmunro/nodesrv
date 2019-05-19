import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {EventType} from "../../../event/enum/eventType"
import EventService from "../../../event/eventService"
import {createMobEvent} from "../../../event/factory"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class QuitAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .not().requireFight()
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    await this.eventService.publish(createMobEvent(EventType.ClientLogout, requestService.getMob()))
    return requestService.respondWith().success()
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Quit
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
