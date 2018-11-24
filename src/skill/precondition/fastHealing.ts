import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { SkillType } from "../skillType"

export default async function(request: Request, service: GameService): Promise<Check> {
  return request.check(service.mobService)
    .requireSkill(SkillType.FastHealing)
    .requireLevel(5)
    .create()
}
