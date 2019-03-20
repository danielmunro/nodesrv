import AffectBuilder from "../../../../../affect/affectBuilder"
import {AffectType} from "../../../../../affect/affectType"
import AttributeBuilder from "../../../../../attributes/attributeBuilder"
import {newHitroll, newStats} from "../../../../../attributes/factory"
import AbilityService from "../../../../../check/abilityService"
import {CheckType} from "../../../../../check/checkType"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import {Mob} from "../../../../../mob/model/mob"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {ActionType} from "../../../../enum/actionType"
import AffectSpell from "../../affectSpell"
import AffectSpellBuilder from "../../affectSpellBuilder"

export default function(abilityService: AbilityService): AffectSpell {
  return new AffectSpellBuilder(abilityService)
    .setSpellType(SpellType.Poison)
    .setActionType(ActionType.Offensive)
    .setCosts([ new ManaCost(20), new DelayCost(1) ])
    .setCreateAffect(checkedRequest => new AffectBuilder(AffectType.Poison)
      .setLevel(checkedRequest.getCheckTypeResult(CheckType.HasSpell).level / 2)
      .setAttributes(new AttributeBuilder()
        .setHitRoll(newHitroll(0, -1))
        .setStats(newStats(-1, 0, 0, 0, -1, -1))
        .build())
      .build())
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.Poison.Success,
        { target, verb: "feels" },
        { target: "you", verb: "feel" },
        { target, verb: "feels" })
    })
    .create()
}
