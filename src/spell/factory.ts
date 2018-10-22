import { ActionType } from "../action/actionType"
import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import { DamageType } from "../damage/damageType"
import { Request } from "../request/request"
import Response from "../request/response"
import { Spell } from "./model/spell"
import SpellDefinition from "./spellDefinition"
import { SpellType } from "./spellType"

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
