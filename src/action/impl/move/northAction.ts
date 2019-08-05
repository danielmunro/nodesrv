import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import LocationService from "../../../mob/service/locationService"
import {RequestType} from "../../../request/enum/requestType"
import {Direction} from "../../../room/enum/direction"
import {Types} from "../../../support/types"
import Move from "../move"

@injectable()
export default class NorthAction extends Move {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.LocationService) locationService: LocationService) {
    super(checkBuilderFactory, locationService, Direction.North)
  }

  public getRequestType(): RequestType {
    return RequestType.North
  }
}
