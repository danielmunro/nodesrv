import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import LocationService from "../../../mob/locationService"
import {RequestType} from "../../../request/requestType"
import {Direction} from "../../../room/constants"
import Move from "../../move"
import LookAction from "../info/lookAction"

export default class SouthAction extends Move {
  constructor(checkBuilderFactory: CheckBuilderFactory, locationService: LocationService, look: LookAction) {
    super(checkBuilderFactory, locationService, look, Direction.South)
  }

  public getRequestType(): RequestType {
    return RequestType.South
  }
}
