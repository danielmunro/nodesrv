import { Request } from "../../request/request"
import Check from "../check/check"
import CheckBuilder from "../check/checkBuilder"
import { CheckType } from "../check/checkType"
import { MESSAGE_REMOVE_FAIL } from "./constants"

export default function(request: Request): Promise<Check> {
  const item = request.mob.equipped.inventory.findItemByName(request.subject)

  return new CheckBuilder().require(item, MESSAGE_REMOVE_FAIL, CheckType.HasItem).create(item)
}
