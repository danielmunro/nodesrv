import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import LocationService from "../../../mob/service/locationService"
import {RequestType} from "../../../request/enum/requestType"
import {Direction} from "../../../room/constants"
import Move from "../../move"

export default class NorthAction extends Move {
  constructor(checkBuilderFactory: CheckBuilderFactory, locationService: LocationService) {
    super(checkBuilderFactory, locationService, Direction.North)
  }

  public getRequestType(): RequestType {
    return RequestType.North
  }
}
