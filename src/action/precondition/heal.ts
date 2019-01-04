import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import GameService from "../../gameService/gameService"
import {Request} from "../../request/request"
import { Messages} from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const healer = service.getMobsByRoom(request.room).find(mob => mob.isHealer())

  return new CheckBuilder(service.mobService)
    .requireMob(healer, Messages.Heal.Fail.HealerNotFound)
    .create()
}
