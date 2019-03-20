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
    .setSpellType(SpellType.StoneSkin)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(12),
      new DelayCost(1),
    ])
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.StoneSkin.Success,
        { target: target === checkedRequest.mob ? "your" : `${target.name}'s` },
        { target: "your" },
        { target: `${target.name}'s` })
    })
    .setCreateAffect(checkedRequest => new AffectBuilder(AffectType.StoneSkin)
      .setLevel(checkedRequest.mob.level)
      .setTimeout(checkedRequest.mob.level / 2)
      .build())
    .create()
}
