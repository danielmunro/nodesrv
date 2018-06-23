import { Request } from "../../request/request"
import { Status } from "../../spell/check"
import spellCollection from "../../spell/spellCollection"
import Response from "../../request/response"

export const MESSAGE_NO_SPELL = "What do you want to cast?"
export const MESSAGE_SPELL_DOES_NOT_EXIST = "That is not a spell."
export const MESSAGE_ERROR = "You don't know that spell."
export const MESSAGE_FAIL = "You lose your concentration."

export default function(request: Request): Promise<Response> {
  if (!request.subject) {
    return request.error(MESSAGE_NO_SPELL)
  }

  const spellDefinition = spellCollection.collection.find((spell) => spell.spellType.startsWith(request.subject))

  if (!spellDefinition) {
    return request.error(MESSAGE_SPELL_DOES_NOT_EXIST)
  }

  const check = spellDefinition.check(request)

  if (check.status === Status.Error) {
    return request.error(MESSAGE_ERROR)
  }

  spellDefinition.apply(check)

  if (check.status === Status.Fail) {
    return request.fail(check.fail)
  }

  return request.ok(`You utter the words, '${spellDefinition.spellType}'.`)
}
