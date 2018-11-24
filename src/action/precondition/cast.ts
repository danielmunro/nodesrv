import Check from "../../check/check"
import { Request } from "../../request/request"
import Service from "../../service/service"
import getSpellTable from "../../spell/spellTable"
import {
  MESSAGE_NO_SPELL,
  MESSAGE_SPELL_DOES_NOT_EXIST,
} from "./constants"

export default function(request: Request, service: Service): Promise<Check> {
  if (!request.getContextAsInput().subject) {
    return Check.fail(MESSAGE_NO_SPELL)
  }

  const spellDefinition = getSpellTable(service).collection.find(spell =>
    spell.spellType.startsWith(request.getContextAsInput().subject))

  if (!spellDefinition) {
    return Check.fail(MESSAGE_SPELL_DOES_NOT_EXIST)
  }

  return spellDefinition.preconditions(request, service)
}
