import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import { Request } from "../../request/request"
import { Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  return new CheckBuilder()
    .require(
      request.mob.inventory.findItemByName(request.subject),
      Messages.All.Item.NotOwned,
      CheckType.ItemPresent)
    .create()
}
