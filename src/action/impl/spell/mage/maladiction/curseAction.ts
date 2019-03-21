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
    .setSpellType(SpellType.Curse)
    .setAffectType(AffectType.Curse)
    .setActionType(ActionType.Offensive)
    .setCosts([ new ManaCost(20), new DelayCost(1) ])
    .setCreateAffect((checkedRequest, affectBuilder) => affectBuilder
      .setTimeout(checkedRequest.mob.level / 10)
      .setAttributes(new AttributeBuilder()
        .setStats(newStats(-1, -1, -1, -1, -1, -1))
        .setHitRoll(newHitroll(1, -4))
        .build())
      .build())
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.Curse.Success,
        { target, verb: "is" },
        { target: "you", verb: "are" },
        { target, verb: "is" })
    })
    .create()
}
