import AffectBuilder from "../../../../../affect/affectBuilder"
import {AffectType} from "../../../../../affect/affectType"
import AttributeBuilder from "../../../../../attributes/attributeBuilder"
import {newHitroll} from "../../../../../attributes/factory"
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
    .setSpellType(SpellType.Bless)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(10),
      new DelayCost(1),
    ])
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.Bless.Success,
        {
          target: target === checkedRequest.mob ? "you" : target,
          verb: target === checkedRequest.mob ? "feel" : "feels",
        },
        { target: "you", verb: "feel" },
        { target, verb: "feels" })
    })
    .setCreateAffect(checkedRequest => new AffectBuilder(AffectType.Bless)
      .setTimeout(checkedRequest.mob.level)
      .setLevel(checkedRequest.mob.level)
      .setAttributes(new AttributeBuilder()
        .setHitRoll(newHitroll(1, checkedRequest.mob.level / 8))
        .build())
      .build())
    .create()
}
