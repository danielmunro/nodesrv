import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import ResponseMessage from "../../../../request/responseMessage"
import ResponseMessageBuilder from "../../../../request/responseMessageBuilder"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import {ActionType} from "../../../enum/actionType"
import SpellBuilder from "../../../spellBuilder"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.DetectHidden)
    .setAffectType(AffectType.DetectHidden)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setSuccessMessage(checkedRequest =>
      new ResponseMessageBuilder(
        checkedRequest.mob,
        SpellMessages.DetectHidden.Success,
        checkedRequest.getCheckTypeResult(CheckType.HasTarget))
        .setTargetPossessive()
        .setPluralizeTarget()
        .create())
    .setApplySpell(async (checkedRequest, affectBuilder) => affectBuilder
      .setTimeout(checkedRequest.mob.level / 7)
      .build())
    .create()
}
