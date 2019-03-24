import {AffectType} from "../../../../../affect/affectType"
import AttributeBuilder from "../../../../../attributes/attributeBuilder"
import {newHitroll, newStats, newVitals} from "../../../../../attributes/factory"
import AbilityService from "../../../../../check/abilityService"
import {CheckType} from "../../../../../check/checkType"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {ActionType} from "../../../../enum/actionType"
import SpellBuilder from "../../../../spellBuilder"
import Spell from "../../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.Wrath)
    .setAffectType(AffectType.Wrath)
    .setActionType(ActionType.Offensive)
    .setCosts([ new ManaCost(35), new DelayCost(1) ])
    .setApplySpell((checkedRequest, affectBuilder) => affectBuilder
      .setAttributes(new AttributeBuilder()
        .setVitals(newVitals(-checkedRequest.mob.level / 10, 0, 0))
        .setStats(newStats(0, -2, -2, 0, 0, 0))
        .setHitRoll(newHitroll(1, -4))
        .build())
      .build())
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.Wrath.Success,
        { target, verb: "is" },
        { verb: "are" },
        { target, verb: "is" })
    })
    .create()
}
