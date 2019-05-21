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

function calculateBaseDamage(): number {
  return roll(1, 4)
}

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.MagicMissile)
    .setActionType(ActionType.Offensive)
    .setCosts([
      new ManaCost(15),
      new DelayCost(1),
    ])
    .setApplySpell(async requestService => {
      const target = requestService.getResult(CheckType.HasTarget)
      target.vitals.hp -= calculateBaseDamage()
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.MagicMissile.Success)
        .setVerbToRequestCreator("is")
        .setVerbToTarget("are")
        .setVerbToObservers("is")
        .create())
    .create()
}
