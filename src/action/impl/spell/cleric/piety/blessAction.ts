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
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import AffectSpell from "../../affectSpell"

export default function(abilityService: AbilityService) {
  return new AffectSpell(
    abilityService,
    SpellType.Bless,
    ActionType.Defensive,
    [
      new ManaCost(10),
      new DelayCost(1),
    ],
    checkedRequest => {
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
    },
    checkedRequest => new AffectBuilder(AffectType.Bless)
      .setTimeout(checkedRequest.mob.level)
      .setLevel(checkedRequest.mob.level)
      .setAttributes(new AttributeBuilder()
        .setHitRoll(newHitroll(1, checkedRequest.mob.level / 8))
        .build())
      .build(),
    Messages.Help.NoActionHelpTextProvided)
}
