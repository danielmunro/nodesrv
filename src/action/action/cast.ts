import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import spellTable from "../../spell/spellTable"
import { Messages } from "./constants"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const check = checkedRequest.check
  const spellDefinition = spellTable.collection.find(spell =>
    spell.spellType.startsWith(request.getContextAsInput().subject))

  await spellDefinition.doAction(check.result)

  return checkedRequest.respondWith().success(
      Messages.Cast.Success,
    { verb: "utter", spell: spellDefinition.spellType },
    { verb: "utters", spell: spellDefinition.spellType })
}
