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
    SpellType.ChillTouch,
    DamageType.Frost,
    (_: SpellModel, specializationType) =>
      roll(4, 6 + specializationType === SpecializationType.Mage ? 2 : 0),
    "chilling touch")
}
