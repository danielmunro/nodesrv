import AbilityService from "../../../../check/abilityService"
import {DamageType} from "../../../../mob/fight/enum/damageType"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {Spell as SpellModel} from "../../../../spell/model/spell"
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
      roll(spell.level / 10, specializationType === SpecializationType.Mage ? 14 : 10),
    "blast of acid")
}
