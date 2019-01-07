import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import CheckTemplate from "../../check/checkTemplate"
import SkillDefinition from "../skillDefinition"

export default function(request: Request, skillDefinition: SkillDefinition, service: GameService): Promise<Check> {
  return new CheckTemplate(service.mobService, request)
    .perform(skillDefinition)
    .requireFight()
    .create()
}
