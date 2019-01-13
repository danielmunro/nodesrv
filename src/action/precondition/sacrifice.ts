import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { MESSAGE_FAIL_CONTAINER_NOT_EMPTY, Messages } from "./constants"

export default async function(request: Request, service: GameService): Promise<Check> {
  return service.createDefaultCheckFor(request)
    .require(request.findItemInRoomInventory(), Messages.All.Item.NotFound)
    .capture()
    .not()
    .requireAffect(AffectType.NoSacrifice, Messages.All.Item.CannotSacrifice)
    .require(item => item.isContainer()
      ? item.container.items.length === 0 : true, MESSAGE_FAIL_CONTAINER_NOT_EMPTY)
    .create()
}
