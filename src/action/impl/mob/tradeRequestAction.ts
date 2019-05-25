import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {Mob} from "../../../mob/model/mob"
import Escrow from "../../../mob/trade/escrow"
import EscrowService from "../../../mob/trade/escrowService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class TradeRequestAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly escrowService: EscrowService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
      .capture()
      .require(
        () => !this.escrowService.findEscrowForMobs(request.mob, request.getTargetMobInRoom() as Mob),
        Messages.Trade.AlreadyInitialized)
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Thing, ActionPart.MobInRoom ]
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.TradeRequest
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const target = requestService.getTarget()
    const escrow = new Escrow(requestService.getMob(), target)
    this.escrowService.addEscrow(escrow)
    return requestService.respondWith().success(
      Messages.Trade.Initialized,
      { target },
      { target: "you" },
      { target })
  }
}
