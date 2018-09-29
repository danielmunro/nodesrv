import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import spellCollection from "../../spell/spellCollection"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const check = checkedRequest.check
  const spellDefinition = spellCollection.collection.find((spell) => spell.spellType.startsWith(request.subject))

  spellDefinition.apply(check.result)

  return request.respondWith().success(`You utter the words, '${spellDefinition.spellType}'.`)
}
