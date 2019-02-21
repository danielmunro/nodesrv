import {AffectType} from "../affect/affectType"
import {applyAffectModifier} from "../affect/applyAffect"
import Check from "../check/check"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import CheckedRequest from "../check/checkedRequest"
import Cost from "../check/cost/cost"
import {CostType} from "../check/cost/costType"
import {Disposition} from "../mob/enum/disposition"
import {Trigger} from "../mob/enum/trigger"
import LocationService from "../mob/locationService"
import EventContext from "../request/context/eventContext"
import {Request} from "../request/request"
import {RequestType} from "../request/requestType"
import Response from "../request/response"
import {Direction} from "../room/constants"
import {Exit} from "../room/model/exit"
import Action from "./action"
import {ConditionMessages, Messages} from "./constants"
import {ActionPart} from "./enum/actionPart"
import LookAction from "./impl/info/lookAction"

export default abstract class Move extends Action {
  private static calculateMvCost(request: Request) {
    return applyAffectModifier(
      request.mob.affects.map(a => a.affectType),
      Trigger.MovementCost,
      request.room.getMovementCost())
  }

  private static eitherNoDoorOrDoorIsOpen(exit: Exit) {
    return !exit.door || !exit.door.isClosed
  }

  protected constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly locationService: LocationService,
    private readonly look: LookAction,
    private readonly direction: Direction) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .require(this.aValidExit(request.room.exits), ConditionMessages.Move.Fail.DirectionDoesNotExist)
      .require(Move.eitherNoDoorOrDoorIsOpen, ConditionMessages.Move.Fail.DoorIsClosed)
      .capture(request.mob)
      .not().requireAffect(AffectType.Immobilize, ConditionMessages.Move.Fail.Immobilized)
      .addCost(new Cost(CostType.Mv, Move.calculateMvCost(request), ConditionMessages.Move.Fail.OutOfMovement))
      .create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const request = checkedRequest.request
    request.mob.vitals.mv -= request.getRoom().getMovementCost()
    await this.locationService.moveMob(request.mob, this.direction)
    const response = await this.look.handle(new Request(request.mob, request.room, new EventContext(RequestType.Look)))
    return checkedRequest.respondWith().info(response.message.getMessageToRequestCreator())
  }

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
