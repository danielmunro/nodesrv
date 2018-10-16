import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import spellCollection from "../../spell/spellCollection"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const check = checkedRequest.check
  const spellDefinition = spellCollection.collection.find(spell =>
    spell.spellType.startsWith(request.getContextAsInput().subject))

  spellDefinition.apply(check.result)

  return checkedRequest.respondWith().success(
      Messages.Cast.Success,
    { verb: "utter", spell: spellDefinition.spellType },
    { verb: "utters", spell: spellDefinition.spellType })
}
