import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import { Request } from "../../request/request"
import { MESSAGE_REMOVE_FAIL } from "./constants"

export default function(request: Request): Promise<Check> {
  const item = request.mob.equipped.inventory.findItemByName(request.getContextAsInput().subject)

  return new CheckBuilder().require(item, MESSAGE_REMOVE_FAIL, CheckType.HasItem).create(item)
}
