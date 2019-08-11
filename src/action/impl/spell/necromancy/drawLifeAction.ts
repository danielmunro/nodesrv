import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import roll from "../../../../support/random/dice"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.DrawLife)
    .setActionType(ActionType.Offensive)
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setApplySpell(async requestService => {
      const target = requestService.getTarget<MobEntity>()
      const amount = roll(2, target.level / 2)
      target.hp -= amount
      requestService.getMob().hp += amount
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.DrawLife.Success)
        .setVerbToRequestCreator("siphon")
        .setVerbToTarget("siphons")
        .setVerbToObservers("siphons")
        .create())
    .setSpecializationType(SpecializationType.Mage)
    .create()
}
