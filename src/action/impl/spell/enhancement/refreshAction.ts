import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {CheckType} from "../../../../check/enum/checkType"
import AbilityService from "../../../../check/service/abilityService"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.RefreshMovement)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.RefreshMovement.Success)
        .setVerbToRequestCreator("feels")
        .setVerbToTarget("feel")
        .setVerbToObservers("feels")
        .create())
    .setApplySpell(async requestService => {
      const target = requestService.getResult(CheckType.HasTarget)
      const attr = target.attribute()
      attr.addMv(requestService.getResult(CheckType.HasSpell).level / 3)
    })
    .setSpecializationType(SpecializationType.Cleric)
    .create()
}
