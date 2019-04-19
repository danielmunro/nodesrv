import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import ResponseMessage from "../../../../request/responseMessage"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import roll from "../../../../support/random/dice"
import {ActionType} from "../../../enum/actionType"
import SpellBuilder from "../../../spellBuilder"
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
      const target = requestService.getTarget()
      const amount = roll(2, target.level / 2)
      target.vitals.hp -= amount
      requestService.getMob().vitals.hp += amount
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.DrawLife.Success)
        .setVerbToRequestCreator("siphon")
        .setVerbToTarget("siphons")
        .setVerbToObservers("siphons")
        .create())
    .create()
}
