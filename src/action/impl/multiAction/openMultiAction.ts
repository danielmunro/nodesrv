import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import OpenItemAction from "../item/openItemAction"
import OpenDoorAction from "../manipulate/openDoorAction"
import MultiAction from "../multiAction"

export default function(checkBuilderFactory: CheckBuilderFactory) {
  return new MultiAction(
    RequestType.Open,
    ConditionMessages.All.Arguments.Open,
    [ ActionPart.Action, ActionPart.Target ],
    [
      new OpenItemAction(checkBuilderFactory),
      new OpenDoorAction(checkBuilderFactory),
    ])
}
