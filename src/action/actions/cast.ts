import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import spellCollection from "../../spell/spellCollection"
import { format } from "../../support/string"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const check = checkedRequest.check
  const spellDefinition = spellCollection.collection.find(spell =>
    spell.spellType.startsWith(request.getContextAsInput().subject))

  spellDefinition.apply(check.result)

  return checkedRequest.respondWith().success(
    new ResponseMessage(
      Messages.Cast.Success,
      ["you", "utter", spellDefinition.spellType],
      [request.mob.name, "utters", spellDefinition.spellType]))
}
