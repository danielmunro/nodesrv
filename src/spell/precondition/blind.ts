import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import CheckTemplate from "../../check/checkTemplate"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import SpellDefinition from "../spellDefinition"
import { Messages } from "./constants"

export default function(
  request: Request, spellDefinition: SpellDefinition, service: GameService): Promise<Check> {
  return new CheckTemplate(service.mobService, request)
    .cast(spellDefinition)
    .not().require(mob => mob.getAffect(AffectType.Blind), Messages.Blind.AlreadyBlind)
    .create()
}
