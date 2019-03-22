import AbilityService from "../../../../../check/abilityService"
import {CheckType} from "../../../../../check/checkType"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import roll from "../../../../../random/dice"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"
import SpellBuilder from "../../spellBuilder"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.DrawLife)
    .setActionType(ActionType.Offensive)
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setApplySpell(async checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      const amount = roll(2, target.level / 2)
      target.vitals.hp -= amount
      checkedRequest.mob.vitals.hp += amount
    })
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.DrawLife.Success,
        { target, verb: "siphon" },
        { target: "you", verb: "siphons" },
        { target, verb: "siphons" })
    })
    .create()
}
