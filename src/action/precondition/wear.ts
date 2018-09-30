import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import { Disposition } from "../../mob/disposition"
import { Request } from "../../request/request"
import { Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  return request
    .check()
    .requireDisposition(Disposition.Standing, Messages.Wear.NotStanding)
    .require(
      request.mob.inventory.findItemByName(request.subject),
      Messages.All.Item.NotOwned,
      CheckType.ItemPresent)
    .create()
}
