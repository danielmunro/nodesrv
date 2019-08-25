import { interfaces } from "inversify/dts/interfaces/interfaces"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import EscrowService from "../../../mob/trade/escrowService"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import TradeAddGoldAction from "../mob/trade/tradeAddGoldAction"
import TradeAddItemAction from "../mob/trade/tradeAddItemAction"
import MultiAction from "../multiAction"

export default function(checkBuilderFactory: CheckBuilderFactory, container: interfaces.Container) {
  const escrowService = container.get<EscrowService>(Types.EscrowService)
  return new MultiAction(
    RequestType.TradeAdd,
    ConditionMessages.All.Arguments.Trade,
    [ ActionPart.Action, ActionPart.Directive, ActionPart.Target ],
    [
      new TradeAddItemAction(checkBuilderFactory, escrowService),
      new TradeAddGoldAction(checkBuilderFactory, escrowService),
    ])
}
