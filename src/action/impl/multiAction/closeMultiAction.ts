import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import CloseItemAction from "../item/closeItemAction"
import CloseDoorAction from "../manipulate/closeDoorAction"
import MultiAction from "../multiAction"

export default function(checkBuilderFactory: CheckBuilderFactory) {
  return new MultiAction(
    RequestType.Close,
    ConditionMessages.All.Arguments.Close,
    [ ActionPart.Action, ActionPart.Target ],
    [
      new CloseItemAction(checkBuilderFactory),
      new CloseDoorAction(checkBuilderFactory),
    ])
}
