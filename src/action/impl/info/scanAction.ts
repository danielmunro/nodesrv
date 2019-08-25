import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import MobLocationEntity from "../../../mob/entity/mobLocationEntity"
import {Disposition} from "../../../mob/enum/disposition"
import MobService from "../../../mob/service/mobService"
import match from "../../../support/matcher/match"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import SimpleAction from "../simpleAction"

@injectable()
export default class ScanAction extends SimpleAction {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.MobService) private readonly mobService: MobService) {
    super(checkBuilderFactory, RequestType.Scan)
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory
      .createCheckBuilder(request, Disposition.Standing)
      .require(request.getSubject(), ConditionMessages.Scan.NoSubject)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const mobLocation = this.mobService.getLocationForMob(requestService.getMob())
    const mobLocations = this.mobService
      .findMobsByArea(mobLocation.room.area)
      .filter(location => match(location.mob.name, requestService.getSubject()))
    return requestService.respondWith().success(
      `mobs nearby:\n${mobLocations.reduce((previous: string, current: MobLocationEntity) =>
        previous + current.mob.name + " at " + current.room.name + "\n", "")}`)
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.MobInArea ]
  }
}
