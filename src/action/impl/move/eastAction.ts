import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import LocationService from "../../../mob/service/locationService"
import {Direction} from "../../../room/enum/direction"
import {Types} from "../../../support/types"
import Move from "../move"

@injectable()
export default class EastAction extends Move {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.LocationService) locationService: LocationService) {
    super(checkBuilderFactory, locationService, Direction.East)
  }

  public getRequestType(): RequestType {
    return RequestType.East
  }
}
