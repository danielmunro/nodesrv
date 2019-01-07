import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { SkillType } from "../skillType"
import SkillDefinition from "../skillDefinition"

export default function(request: Request, skillDefinition: SkillDefinition, service: GameService): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .requireSkill(SkillType.Dodge)
    .requireLevel(10)
    .requireFight()
    .create()
}
