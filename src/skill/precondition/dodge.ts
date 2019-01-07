import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import SkillDefinition from "../skillDefinition"
import { SkillType } from "../skillType"

export default function(request: Request, skillDefinition: SkillDefinition, service: GameService): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .requireSkill(SkillType.Dodge)
    .requireLevel(10)
    .requireFight()
    .create()
}
