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
    SpellType.Crusade,
    ActionType.Defensive,
    [
      new ManaCost(20),
      new DelayCost(1),
    ],
    checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.Crusade.Success,
        {
          target: target === checkedRequest.mob ? "you" : target,
          verb: target === checkedRequest.mob ? "are" : "is",
        },
        { target: "you", verb: "are" },
        { target, verb: "is" })
    },
    checkedRequest => new AffectBuilder(AffectType.Crusade)
      .setTimeout(checkedRequest.mob.level / 8)
      .setLevel(checkedRequest.mob.level)
      .setAttributes(new AttributeBuilder()
        .setHitRoll(newHitroll(1, checkedRequest.mob.level / 8))
        .build())
      .build(),
    Messages.Help.NoActionHelpTextProvided)
}
