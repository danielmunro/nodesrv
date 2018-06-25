import { Request } from "../../request/request"
import { Status } from "../../spell/check"
import spellCollection from "../../spell/spellCollection"
import Check from "../check"

export const MESSAGE_NO_SPELL = "What do you want to cast?"
export const MESSAGE_SPELL_DOES_NOT_EXIST = "That is not a spell."
export const MESSAGE_ERROR = "You don't know that spell."
export const MESSAGE_FAIL = "You lose your concentration."
export const MESSAGE_FAIL_NOT_ENOUGH_MANA = "You don't have enough mana."

export default function(request: Request): Promise<Check> {
  if (!request.subject) {
    return Check.fail(MESSAGE_NO_SPELL)
  }

  const spellDefinition = spellCollection.collection.find((spell) => spell.spellType.startsWith(request.subject))

  if (!spellDefinition) {
    return Check.fail(MESSAGE_SPELL_DOES_NOT_EXIST)
  }

  if (request.player.sessionMob.vitals.mana < spellDefinition.manaCost) {
    return Check.fail(MESSAGE_FAIL_NOT_ENOUGH_MANA)
  }

  const check = spellDefinition.check(request)

  if (check.status === Status.Error) {
    return Check.fail(MESSAGE_ERROR)
  }

  if (check.status === Status.Fail) {
    return Check.fail(MESSAGE_FAIL)
  }

  return Check.ok()
}
