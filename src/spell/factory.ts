import { Spell } from "./model/spell"
import { SpellType } from "./spellType"
import { ActionType } from "../action/actionType"
import { DamageType } from "../damage/damageType"
import { Request } from "../request/request"
import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import Response from "../request/response"
import SpellDefinition from "./spellDefinition"

export function newSpell(spellType: SpellType, level: number = 1) {
  const spell = new Spell()
  spell.spellType = spellType
  spell.level = level

  return spell
}

export function newDefinition(
  spellType: SpellType,
  actionType: ActionType,
  precondition: (request: Request) => Promise<Check>,
  action: (checkedRequest: CheckedRequest) => Promise<Response>,
  damageType: DamageType = null): SpellDefinition {
  return new SpellDefinition(
    spellType,
    actionType,
    precondition,
    action,
    damageType,
  )
}
