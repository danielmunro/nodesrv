import AbilityService from "../../../../check/service/abilityService"
import {DamageType} from "../../../../mob/fight/enum/damageType"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellEntity as SpellModel} from "../../../../spell/entity/spellEntity"
import {SpellType} from "../../../../spell/spellType"
import roll from "../../../../support/random/dice"
import Spell from "../../spell"
import attackAction from "./attackAction"

export default function(abilityService: AbilityService): Spell {
  return attackAction(
    abilityService,
    SpellType.AcidBlast,
    DamageType.Acid,
    (spell: SpellModel, specializationType) =>
      roll(spell.level / 10, 10 + specializationType === SpecializationType.Mage ? 4 : 0),
    "blast of acid")
}
