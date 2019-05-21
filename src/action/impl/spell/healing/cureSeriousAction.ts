import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {CheckType} from "../../../../check/enum/checkType"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import roll from "../../../../support/random/dice"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.CureSerious)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(15),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.CureSerious.Success)
      .setVerbToRequestCreator("feels")
      .setVerbToTarget("feel")
      .setVerbToObservers("feels")
      .create())
    .setApplySpell(async requestService => {
      const target = requestService.getResult(CheckType.HasTarget)
      target.vitals.hp += roll(2, 8)
    })
    .create()
}
