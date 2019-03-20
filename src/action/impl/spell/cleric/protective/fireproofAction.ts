import AffectBuilder from "../../../../../affect/affectBuilder"
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
import AffectSpellBuilder from "../../affectSpellBuilder"

export default function(abilityService: AbilityService): Spell {
  return new AffectSpellBuilder(abilityService)
    .setSpellType(SpellType.Fireproof)
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
    .setCreateAffect(checkedRequest => new AffectBuilder(AffectType.Fireproof)
      .setLevel(checkedRequest.mob.level)
      .setTimeout(checkedRequest.mob.level / 8)
      .build())
    .create()
}
