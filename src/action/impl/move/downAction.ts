import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import LocationService from "../../../mob/service/locationService"
import {RequestType} from "../../../request/enum/requestType"
import {Direction} from "../../../room/enum/direction"
import Move from "../move"

export default class DownAction extends Move {
  constructor(checkBuilderFactory: CheckBuilderFactory, locationService: LocationService) {
    super(checkBuilderFactory, locationService, Direction.Down)
  }

  public getRequestType(): RequestType {
    return RequestType.Down
  }
}
