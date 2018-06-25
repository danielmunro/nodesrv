import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import spellCollection from "../../spell/spellCollection"

export default function(request: Request): Promise<Response> {
  const spellDefinition = spellCollection.collection.find((spell) => spell.spellType.startsWith(request.subject))
  const check = spellDefinition.check(request)
  spellDefinition.apply(check)

  return new ResponseBuilder(request).success(`You utter the words, '${spellDefinition.spellType}'.`)
}
