import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import LocationService from "../../../mob/service/locationService"
import {RequestType} from "../../../request/requestType"
import {Direction} from "../../../room/constants"
import Move from "../../move"

export default class EastAction extends Move {
  constructor(checkBuilderFactory: CheckBuilderFactory, locationService: LocationService) {
    super(checkBuilderFactory, locationService, Direction.East)
  }

  public getRequestType(): RequestType {
    return RequestType.East
  }
}
