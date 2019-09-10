import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import DelayCost from "../../../check/cost/delayCost"
import MvCost from "../../../check/cost/mvCost"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Disposition} from "../../../mob/enum/disposition"
import {Fight} from "../../../mob/fight/fight"
import LocationService from "../../../mob/service/locationService"
import MobService from "../../../mob/service/mobService"
import roll from "../../../support/random/dice"
import {pickOne} from "../../../support/random/helpers"
import {Types} from "../../../support/types"
import {
  FLEE_MOVEMENT_COST_MULTIPLIER, HelpMessages,
  MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE,
  MESSAGE_FAIL_NOT_FIGHTING,
  Messages,
} from "../../constants"
import SimpleAction from "../simpleAction"

@injectable()
export default class FleeAction extends SimpleAction {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.MobService) private readonly mobService: MobService,
    @inject(Types.LocationService) private readonly locationService: LocationService) {
    super(checkBuilderFactory, RequestType.Flee, HelpMessages.Flee)
  }

  public check(request: Request): Promise<Check> {
    const mvCost = request.getRoomMvCost() * FLEE_MOVEMENT_COST_MULTIPLIER
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .require(
        this.mobService.findFightForMob(request.mob).get(),
        MESSAGE_FAIL_NOT_FIGHTING,
        CheckType.IsFighting)
      .capture()
      .require(request.getRoomExits().length > 0, MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE)
      .addCost(new DelayCost(1))
      .addCost(new MvCost(mvCost))
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    if (roll(1, 2) === 1) {
      return requestService.respondWith().fail(Messages.Flee.Fail)
    }

    const mob = requestService.getMob()
    const exit = pickOne(requestService.getRoomExits())
    const fight = requestService.getResult<Fight>(CheckType.IsFighting)
    fight.endFight()
    mob.mv -= requestService.getRoomMvCost() * FLEE_MOVEMENT_COST_MULTIPLIER
    await this.locationService.moveMob(mob, exit.direction)

    return requestService.respondWith().success(
      Messages.Flee.Success,
      { direction: exit.direction, verb: "flee" },
      { direction: exit.direction, verb: "flees" })
  }
}
