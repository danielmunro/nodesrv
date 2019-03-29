import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import LocationService from "../../../mob/locationService"
import {RequestType} from "../../../request/requestType"
import {Direction} from "../../../room/constants"
import Move from "../../move"

export default class SouthAction extends Move {
  constructor(checkBuilderFactory: CheckBuilderFactory, locationService: LocationService) {
    super(checkBuilderFactory, locationService, Direction.South)
  }

  public getRequestType(): RequestType {
    return RequestType.South
  }
}
