import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import StateService from "../../../gameService/stateService"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {format} from "../../../support/string"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class TimeAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.StateService) private readonly stateService: StateService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request).create()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.Time
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    return requestService.respondWith()
      .info(format(
        Messages.Time.Info,
        this.stateService.getCurrentTime() > 12 ?
          this.stateService.getCurrentTime() % 12 : this.stateService.getCurrentTime(),
        this.stateService.getCurrentTime() > 12 ? "PM" : "AM"))
  }
}
