import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import StateService from "../../../gameService/stateService"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {format} from "../../../support/string"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import SimpleAction from "../simpleAction"

@injectable()
export default class TimeAction extends SimpleAction {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.StateService) private readonly stateService: StateService) {
    super(checkBuilderFactory, RequestType.Time)
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
