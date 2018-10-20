import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import { Request } from "../../request/request"
import { Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  const room = request.getRoom()

  return request.checkWithStandingDisposition()
    .requireMob(room.mobs.find(m => m.isMerchant()), Messages.All.Item.NoMerchant)
    .require(
      request.mob.inventory.findItemByName(request.getContextAsInput().subject),
      Messages.All.Item.NotOwned,
      CheckType.HasItem)
    .capture()
    .create()
}
