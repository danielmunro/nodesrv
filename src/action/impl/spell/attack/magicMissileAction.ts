import AbilityService from "../../../../check/abilityService"
import {DamageType} from "../../../../mob/fight/enum/damageType"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellType} from "../../../../spell/spellType"
import roll from "../../../../support/random/dice"
import Spell from "../../spell"
import attackAction from "./attackAction"

export default function(abilityService: AbilityService): Spell {
  return attackAction(
    abilityService,
    SpellType.MagicMissile,
    DamageType.Energy,
    (_, specializationType) =>
      roll(1, 4 + (specializationType === SpecializationType.Mage ? 1 : 0)),
    "magic missile")
}
