import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import DelayCost from "../../../check/cost/delayCost"
import MvCost from "../../../check/cost/mvCost"
import {Disposition} from "../../../mob/enum/disposition"
import {Fight} from "../../../mob/fight/fight"
import LocationService from "../../../mob/locationService"
import MobService from "../../../mob/mobService"
import Request from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import roll from "../../../support/random/dice"
import {pickOne} from "../../../support/random/helpers"
import Action from "../../action"
import {
  FLEE_MOVEMENT_COST_MULTIPLIER, HelpMessages,
  MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE,
  MESSAGE_FAIL_NOT_FIGHTING,
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
    const mvCost = request.getRoomMvCost() * FLEE_MOVEMENT_COST_MULTIPLIER
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .require(
        this.mobService.findFight(f => f.isParticipant(request.mob)),
        MESSAGE_FAIL_NOT_FIGHTING,
        CheckType.IsFighting)
      .capture()
      .require(request.room.exits.length > 0, MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE)
      .addCost(new DelayCost(1))
      .addCost(new MvCost(mvCost))
      .create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    if (roll(1, 2) === 1) {
      return checkedRequest.respondWith().fail(Messages.Flee.Fail)
    }

    const request = checkedRequest.request
    const mob = request.mob
    const exit = pickOne(request.room.exits)
    const fight = checkedRequest.getCheckTypeResult(CheckType.IsFighting) as Fight

    fight.participantFled(mob)
    mob.vitals.mv -= request.getRoomMvCost() * FLEE_MOVEMENT_COST_MULTIPLIER
    await this.locationService.moveMob(mob, exit.direction)

    return checkedRequest.respondWith().success(
      Messages.Flee.Success,
      { direction: exit.direction, verb: "flee" },
      { direction: exit.direction, verb: "flees" })
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Flee
  }

  public getHelpText(): string {
    return HelpMessages.Flee
  }
}
