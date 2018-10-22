import Check from "../../check/check"
import { Request } from "../../request/request"
import spellTable from "../../spell/spellTable"
import {
  MESSAGE_NO_SPELL,
  MESSAGE_SPELL_DOES_NOT_EXIST,
} from "./constants"

export default function(request: Request): Promise<Check> {
  if (!request.getContextAsInput().subject) {
    return Check.fail(MESSAGE_NO_SPELL)
  }

  const spellDefinition = spellTable.collection.find(spell =>
    spell.spellType.startsWith(request.getContextAsInput().subject))

  if (!spellDefinition) {
    return Check.fail(MESSAGE_SPELL_DOES_NOT_EXIST)
  }

  return spellDefinition.preconditions(request)
}
