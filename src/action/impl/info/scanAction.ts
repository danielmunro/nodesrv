import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {Disposition} from "../../../mob/enum/disposition"
import MobLocation from "../../../mob/model/mobLocation"
import MobService from "../../../mob/service/mobService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import match from "../../../support/matcher/match"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class ScanAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing).create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const mobLocation = this.mobService.getLocationForMob(requestService.getMob())
    const mobLocations = this.mobService
      .findMobsByArea(mobLocation.room.area)
      .filter(location => match(location.mob.name, requestService.getSubject()))
    return requestService.respondWith().success(
      `mobs nearby:\n${mobLocations.reduce((previous: string, current: MobLocation) =>
        previous + current.mob.name + " at " + current.room.name + "\n", "")}`)
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.MobInArea ]
  }

  public getRequestType(): RequestType {
    return RequestType.Scan
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
