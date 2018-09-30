import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import { Request } from "../../request/request"
import { Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .require(
      request.mob.inventory.findItemByName(request.subject),
      Messages.All.Item.NotOwned,
      CheckType.ItemPresent)
    .create()
}
