import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { MESSAGE_FAIL_CONTAINER_NOT_EMPTY, Messages } from "./constants"

export default async function(request: Request, service: Service): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .require(request.findItemInRoomInventory(), Messages.All.Item.NotFound)
    .capture()
    .not()
    .requireAffect(AffectType.NoSacrifice, Messages.All.Item.CannotSacrifice)
    .require(item => item.isContainer()
      ? item.container.items.length === 0 : true, MESSAGE_FAIL_CONTAINER_NOT_EMPTY)
    .create()
}
