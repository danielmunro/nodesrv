import {AffectType} from "../../../../../affect/affectType"
import AbilityService from "../../../../../check/abilityService"
import {CheckType} from "../../../../../check/checkType"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"
import SpellBuilder from "../../spellBuilder"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.Fireproof)
    .setAffectType(AffectType.Fireproof)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(10),
      new DelayCost(1),
    ])
    .setSuccessMessage(checkedRequest => {
      const caster = checkedRequest.mob
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        caster,
        SpellMessages.Fireproof.Success,
        {
          target: target === caster ? "you" : target,
          verb: target === caster ? "glow" : "glows",
        },
        { target: "you", verb: "glow" },
        { target, verb: "glows" })
    })
    .setApplySpell((checkedRequest, affectBuilder) => affectBuilder
      .setTimeout(checkedRequest.mob.level / 8)
      .build())
    .create()
}
