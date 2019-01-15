import Check from "../../check/check"
import CheckTemplate from "../../check/checkTemplate"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import Spell from "../spell"

export default function(
  request: Request, spellDefinition: Spell, service: GameService): Promise<Check> {
  return new CheckTemplate(service.mobService, request)
    .cast(spellDefinition)
    .create()
}
