import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import {Disposition} from "../../../mob/enum/disposition"
import {Fight} from "../../../mob/fight/fight"
import LocationService from "../../../mob/locationService"
import MobService from "../../../mob/mobService"
import roll from "../../../random/dice"
import {pickOne} from "../../../random/helpers"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {
  FLEE_MOVEMENT_COST_MULTIPLIER,
  MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE,
  MESSAGE_FAIL_NOT_FIGHTING,
  MESSAGE_FAIL_TOO_TIRED,
  Messages,
} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class FleeAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly mobService: MobService,
    private readonly locationService: LocationService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const mvCost = request.getRoom().getMovementCost() * FLEE_MOVEMENT_COST_MULTIPLIER
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .require(
        this.mobService.findFight(f => f.isParticipant(request.mob)),
        MESSAGE_FAIL_NOT_FIGHTING,
        CheckType.IsFighting)
      .capture()
      .require(request.getRoom().exits.length > 0, MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE)
      .addCost(new Cost(CostType.Delay, 1))
      .addCost(new Cost(CostType.Mv, mvCost, MESSAGE_FAIL_TOO_TIRED))
      .create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    if (roll(1, 2) === 1) {
      return checkedRequest.respondWith().fail(Messages.Flee.Fail)
    }

    const request = checkedRequest.request
    const mob = request.mob
    const room = request.getRoom()
    const exit = pickOne(room.exits)
    const fight = checkedRequest.getCheckTypeResult(CheckType.IsFighting) as Fight

    fight.participantFled(mob)
    mob.vitals.mv -= room.getMovementCost() * FLEE_MOVEMENT_COST_MULTIPLIER
    await this.locationService.moveMob(mob, exit.direction)

    return checkedRequest.respondWith().success(
      Messages.Flee.Success,
      { direction: exit.direction, verb: "flee" },
      { direction: exit.direction, verb: "flees" })
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Flee
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
