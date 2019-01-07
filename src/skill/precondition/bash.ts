import Check from "../../check/check"
import CheckTemplate from "../../check/checkTemplate"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import SkillDefinition from "../skillDefinition"

export default function(request: Request, skillDefinition: SkillDefinition, service: GameService): Promise<Check> {
  return new CheckTemplate(service.mobService, request)
    .perform(skillDefinition)
    .create()
}
