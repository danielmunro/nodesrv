import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import roll from "../../../../support/random/dice"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.Heal)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(50),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.Heal.Success)
      .setVerbToRequestCreator("is")
      .setVerbToTarget("are")
      .setVerbToObservers("is")
      .create())
    .setApplySpell(async requestService => {
      const target = requestService.getTarget() as MobEntity
      target.hp += roll(20, 4)
    })
    .setSpecializationType(SpecializationType.Cleric)
    .create()
}
