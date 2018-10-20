import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import { Request } from "../../request/request"
import { MESSAGE_REMOVE_FAIL } from "./constants"

export default function(request: Request): Promise<Check> {
  return new CheckBuilder()
    .require(
      request.mob.equipped.inventory.findItemByName(request.getContextAsInput().subject),
      MESSAGE_REMOVE_FAIL,
      CheckType.HasItem)
    .create()
}
