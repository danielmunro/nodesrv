import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { Messages } from "./constants"

export default function(request: Request, service: Service): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .require(
      request.mob.inventory.findItemByName(request.getContextAsInput().subject),
      Messages.All.Item.NotOwned,
      CheckType.HasItem)
    .capture()
    .require(item => !!item.equipment, Messages.All.Item.NotEquipment)
    .create()
}
