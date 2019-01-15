import Check from "../../check/check"
import CheckTemplate from "../../check/checkTemplate"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import Skill from "../skill"
import { Messages } from "./constants"

export default async function(
  request: Request, skillDefinition: Skill, service: GameService): Promise<Check> {
  return new CheckTemplate(service.mobService, request)
    .perform(skillDefinition)
    .not().requireFight(Messages.All.Fighting)
    .create()
}
