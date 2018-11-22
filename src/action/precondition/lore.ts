import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { Messages } from "./constants"

export default function(request: Request, service: Service): Promise<Check> {
  const itemTable = service.itemTable
  const mobInventory = request.mob.inventory
  const item = itemTable.findItemByInventory(mobInventory, request.getContextAsInput().subject)

  return new CheckBuilder()
    .require(item, Messages.All.Item.NotFound, CheckType.HasItem)
    .require(item.identified, Messages.Lore.FailNotIdentified)
    .create()
}
