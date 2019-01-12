import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import getSpellTable from "../../spell/spellTable"
import {Messages} from "./constants"

export default async function(request: Request, service: GameService): Promise<Check> {
  const actionCheck = await service.createCheckFor(request.mob)
    .requireSubject(request, Messages.All.Arguments.Cast)
    .require(getSpellTable(service).find(s =>
      s.spellType.startsWith(request.getSubject())), Messages.Cast.NotASpell)
    .capture()
    .create()
  if (!actionCheck.isOk()) {
    return actionCheck
  }
  const spell = actionCheck.result
  return spell.preconditions(request, spell, service)
}
