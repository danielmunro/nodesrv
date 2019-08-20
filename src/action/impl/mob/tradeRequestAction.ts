import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import Escrow from "../../../mob/trade/escrow"
import EscrowService from "../../../mob/trade/escrowService"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class TradeRequestAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.EscrowService) private readonly escrowService: EscrowService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(this.getActionParts())
      .capture()
      .require(
        () => !this.escrowService.findEscrowForMobs(request.mob, request.getTargetMobInRoom()),
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
    const target = requestService.getTarget<MobEntity>()
    const escrow = new Escrow(requestService.getMob(), target)
    this.escrowService.addEscrow(escrow)
    return requestService.respondWith().success(
      Messages.Trade.Initialized,
      { target },
      { target: "you" },
      { target })
  }
}
