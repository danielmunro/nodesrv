import Check from "../../check/check"
import {CheckType} from "../../check/checkType"
import GameService from "../../gameService/gameService"
import {Request} from "../../request/request"
import {Messages} from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const merchant = service.getMobsByRoom(request.room).find(mob => mob.isMerchant())

  return service.createDefaultCheckFor(request)
    .require(merchant, Messages.All.Item.NoMerchant, CheckType.HasTarget)
    .create()
}
