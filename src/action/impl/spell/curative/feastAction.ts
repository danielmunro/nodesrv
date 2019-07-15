import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.Feast)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setApplySpell(async requestService => {
      const target = requestService.getTarget<MobEntity>()
      target.playerMob.hunger = target.playerMob.appetite
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.Feast.Success)
        .setVerbToRequestCreator("feels")
        .setVerbToTarget("feel")
        .setVerbToObservers("feels")
        .create())
    .setSpecializationType(SpecializationType.Cleric)
    .create()
}
