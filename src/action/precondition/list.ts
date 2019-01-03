import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import GameService from "../../gameService/gameService"
import {Request} from "../../request/request"
import { Messages} from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const merchant = service.getMobsByRoom(request.room).find(mob => mob.isMerchant())

  return new CheckBuilder(service.mobService)
    .requireMob(merchant, Messages.All.Item.NoMerchant)
    .create()
}
