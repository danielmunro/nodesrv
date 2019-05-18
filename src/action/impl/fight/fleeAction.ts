import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import DelayCost from "../../../check/cost/delayCost"
import MvCost from "../../../check/cost/mvCost"
import {CheckType} from "../../../check/enum/checkType"
import {Disposition} from "../../../mob/enum/disposition"
import {Fight} from "../../../mob/fight/fight"
import LocationService from "../../../mob/service/locationService"
import MobService from "../../../mob/service/mobService"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
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
    const fight = requestService.getResult(CheckType.IsFighting) as Fight

    fight.participantFled(mob)
    mob.vitals.mv -= requestService.getRoomMvCost() * FLEE_MOVEMENT_COST_MULTIPLIER
    await this.locationService.moveMob(mob, exit.direction)

    return requestService.respondWith().success(
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
