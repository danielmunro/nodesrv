import { Request } from "../../request/request"
import { Check as SpellCheck, Status } from "../../spell/check"
import spellCollection from "../../spell/spellCollection"
import Check from "../check/check"
import {
  MESSAGE_CAST_ERROR,
  MESSAGE_CAST_FAIL,
  MESSAGE_FAIL_NOT_ENOUGH_MANA,
  MESSAGE_NO_SPELL,
  MESSAGE_SPELL_DOES_NOT_EXIST,
} from "./constants"

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

  const spellCheck = new SpellCheck(request, spellDefinition)

  if (spellCheck.status === Status.Error) {
    return Check.fail(MESSAGE_CAST_ERROR)
  }

  if (spellCheck.status === Status.Fail) {
    return Check.fail(MESSAGE_CAST_FAIL)
  }

  return Check.ok(spellCheck)
}
