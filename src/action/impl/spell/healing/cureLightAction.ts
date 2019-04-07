import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
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
    .setSpellType(SpellType.CureLight)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(10),
      new DelayCost(1),
    ])
    .setApplySpell(async checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      target.vitals.hp += roll(1, 4)
    })
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.CureLight.Success,
        { target: target === checkedRequest.mob ? "you" : target,
          verb: target === checkedRequest.mob ? "feel" : "feels" },
        { target: "you", verb: "feel" },
        { target, verb: "feels" })
    })
    .create()
}
