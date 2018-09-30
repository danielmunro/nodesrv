import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import spellCollection from "../../spell/spellCollection"
import { format } from "../../support/string"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const check = checkedRequest.check
  const spellDefinition = spellCollection.collection.find((spell) => spell.spellType.startsWith(request.subject))

  spellDefinition.apply(check.result)

  return checkedRequest.respondWith().success(format(Messages.Cast.Success, spellDefinition.spellType))
}
