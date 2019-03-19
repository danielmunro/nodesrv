import AffectBuilder from "../../../../../affect/affectBuilder"
import {AffectType} from "../../../../../affect/affectType"
import CheckBuilderFactory from "../../../../../check/checkBuilderFactory"
import {CheckType} from "../../../../../check/checkType"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import EventService from "../../../../../event/eventService"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import AffectSpell from "../../affectSpell"

export default function(checkBuilderFactory: CheckBuilderFactory, eventService: EventService) {
  return new AffectSpell(
    checkBuilderFactory,
    eventService,
    SpellType.Fireproof,
    ActionType.Defensive,
    [
      new ManaCost(10),
      new DelayCost(1),
    ],
    checkedRequest => {
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
    },
    checkedRequest => new AffectBuilder(AffectType.Fireproof)
      .setLevel(checkedRequest.mob.level)
      .setTimeout(checkedRequest.mob.level / 8)
      .build(),
    Messages.Help.NoActionHelpTextProvided)
}
