import {AffectType} from "../../../../../affect/affectType"
import AbilityService from "../../../../../check/abilityService"
import {CheckType} from "../../../../../check/checkType"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {ActionType} from "../../../../enum/actionType"
import AffectSpell from "../../affectSpell"
import AffectSpellBuilder from "../../affectSpellBuilder"

export default function(abilityService: AbilityService): AffectSpell {
  return new AffectSpellBuilder(abilityService)
    .setSpellType(SpellType.Blind)
    .setAffectType(AffectType.Blind)
    .setActionType(ActionType.Offensive)
    .setCosts([ new ManaCost(20), new DelayCost(1) ])
    .setCreateAffect((checkedRequest, affectBuilder) => affectBuilder
      .setTimeout(checkedRequest.mob.level / 10)
      .build())
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.Blind.Success,
        { target, verb: "is" },
        { verb: "are" },
        { target, verb: "is" })
    })
    .create()
}
