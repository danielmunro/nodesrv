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

function calculateBaseDamage(): number {
  return roll(2, 6)
}

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.LightningBolt)
    .setActionType(ActionType.Offensive)
    .setCosts([
      new ManaCost(15),
      new DelayCost(1),
    ])
    .setApplySpell(async checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      target.vitals.hp -= calculateBaseDamage()
    })
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.MagicMissile.Success,
        { target, verb: "is" },
        { verb: "are" },
        { target, verb: "is" })
    })
    .create()
}
