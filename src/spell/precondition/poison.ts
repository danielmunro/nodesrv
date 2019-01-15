import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import CheckTemplate from "../../check/checkTemplate"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import Spell from "../spell"
import { Messages } from "./constants"

export default function(request: Request, spellDefinition: Spell, gameService: GameService): Promise<Check> {
  return new CheckTemplate(gameService.mobService, request)
    .cast(spellDefinition)
    .not().requireAffect(AffectType.Poison, Messages.Poison.AlreadyPoisoned)
    .create()
}
