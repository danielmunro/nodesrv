import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import StateService from "../../../gameService/stateService"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {getWeatherTransitionMessage} from "../../../region/constants"
import {Types} from "../../../support/types"
import SimpleAction from "../simpleAction"

@injectable()
export default class WeatherAction extends SimpleAction {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.StateService) private readonly stateService: StateService) {
    super(checkBuilderFactory, RequestType.Weather)
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const region = requestService.getRoom().region
    return requestService.respondWith()
      .info(getWeatherTransitionMessage(this.stateService.getWeatherForRegion(region)))
  }
}
