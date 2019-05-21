import {applyAffectModifier} from "../../affect/applyAffect"
import {AffectType} from "../../affect/enum/affectType"
import Check from "../../check/check"
import CheckBuilderFactory from "../../check/checkBuilderFactory"
import MvCost from "../../check/cost/mvCost"
import {Disposition} from "../../mob/enum/disposition"
import {Trigger} from "../../mob/enum/trigger"
import LocationService from "../../mob/service/locationService"
import Request from "../../request/request"
import RequestService from "../../request/requestService"
import Response from "../../request/response"
import {Direction} from "../../room/enum/direction"
import {Exit} from "../../room/model/exit"
import {ConditionMessages, Messages} from "../constants"
import {ActionPart} from "../enum/actionPart"
import Action from "./action"

export default abstract class Move extends Action {
  private static calculateMvCost(request: Request) {
    return applyAffectModifier(
      request.mob.affects.map(a => a.affectType),
      Trigger.MovementCost,
      request.getRoomMvCost())
  }

  private static eitherNoDoorOrDoorIsOpen(exit: Exit) {
    return !exit.door || !exit.door.isClosed
  }

  protected constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly locationService: LocationService,
    private readonly direction: Direction) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .require(
        this.aValidExit(request.getRoomExits()),
        ConditionMessages.Move.Fail.DirectionDoesNotExist)
      .require(Move.eitherNoDoorOrDoorIsOpen, ConditionMessages.Move.Fail.DoorIsClosed)
      .capture(request.mob)
      .not().requireAffect(AffectType.Immobilize, ConditionMessages.Move.Fail.Immobilized)
      .addCost(new MvCost(Move.calculateMvCost(request)))
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const request = requestService.getRequest()
    if (!requestService.hasAffect(AffectType.Fly)) {
      request.mob.vitals.mv -= request.getRoomMvCost()
    }
    await this.locationService.moveMob(requestService.getMob(), this.direction)
    return requestService.respondWith().success()
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getDirection(): Direction {
    return this.direction
  }

  private aValidExit(exits: Exit[]) {
    return exits.find(e => e.direction === this.direction)
  }
}
