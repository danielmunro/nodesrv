import CheckedRequest from "../../check/checkedRequest"
import GameService from "../../gameService/gameService"
import Response from "../../request/response"
import getSpellTable from "../../spell/spellTable"
import { Messages } from "./constants"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const request = checkedRequest.request
  const check = checkedRequest.check
  const spellDefinition = getSpellTable(service).find(spell =>
    spell.spellType.startsWith(request.getContextAsInput().subject))

  await spellDefinition.doAction(check.result)

  return checkedRequest.respondWith().success(
      Messages.Cast.Success,
    { verb: "utter", spell: spellDefinition.spellType },
    { verb: "utters", spell: spellDefinition.spellType })
}
