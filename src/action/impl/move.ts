import {unmanaged} from "inversify"
import {AffectType} from "../../affect/enum/affectType"
import AffectService from "../../affect/service/affectService"
import Check from "../../check/check"
import MvCost from "../../check/cost/mvCost"
import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import Request from "../../messageExchange/request"
import Response from "../../messageExchange/response"
import RequestService from "../../messageExchange/service/requestService"
import {Disposition} from "../../mob/enum/disposition"
import {Trigger} from "../../mob/enum/trigger"
import LocationService from "../../mob/service/locationService"
import {ExitEntity} from "../../room/entity/exitEntity"
import {Direction} from "../../room/enum/direction"
import {ConditionMessages, Messages} from "../constants"
import {ActionPart} from "../enum/actionPart"
import Action from "./action"

export default abstract class Move extends Action {
  private static calculateMvCost(request: Request) {
    return AffectService.applyAffectModifier(
      request.mob.affects.map(a => a.affectType),
      Trigger.MovementCost,
      request.getRoomMvCost())
  }

  private static eitherNoDoorOrDoorIsOpen(exit: ExitEntity) {
    return !exit.door || !exit.door.isClosed
  }

  protected constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly locationService: LocationService,
    @unmanaged() private readonly direction: Direction) {
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

  private aValidExit(exits: ExitEntity[]) {
    return exits.find(e => e.direction === this.direction)
  }
}
