import {inject, injectable} from "inversify"
import Check from "../../../../check/check"
import {CheckType} from "../../../../check/enum/checkType"
import CheckBuilderFactory from "../../../../check/factory/checkBuilderFactory"
import {ItemEntity} from "../../../../item/entity/itemEntity"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Request from "../../../../messageExchange/request"
import Response from "../../../../messageExchange/response"
import RequestService from "../../../../messageExchange/service/requestService"
import Escrow from "../../../../mob/trade/escrow"
import EscrowService from "../../../../mob/trade/service/escrowService"
import {Types} from "../../../../support/types"
import {Messages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import Action from "../../action"

@injectable()
export default class TradeAddItemAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.EscrowService) private readonly escrowService: EscrowService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(this.getActionParts())
      .require(
        () => this.escrowService.findEscrowForMob(request.mob),
        Messages.Trade.NotInitialized, CheckType.Escrow)
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Directive, ActionPart.ItemInInventory ]
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.TradeAdd
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const escrow = requestService.getResult<Escrow>(CheckType.Escrow)
    const item = requestService.getResult<ItemEntity>(CheckType.HasItem)
    escrow.addItemForMob(requestService.getMob(), item)
    return requestService.respondWith().success(
      Messages.Trade.ItemAdded,
      { item })
  }
}
