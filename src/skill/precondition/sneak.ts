import Check from "../../check/check"
import CheckTemplate from "../../check/checkTemplate"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import SkillDefinition from "../skillDefinition"
import { Messages } from "./constants"

export default async function(
  request: Request, skillDefinition: SkillDefinition, service: GameService): Promise<Check> {
  return new CheckTemplate(service.mobService, request)
    .perform(skillDefinition)
    .not().requireFight(Messages.All.Fighting)
    .create()
}
