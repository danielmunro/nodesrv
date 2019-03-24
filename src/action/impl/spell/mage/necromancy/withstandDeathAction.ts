import {AffectType} from "../../../../../affect/affectType"
import AbilityService from "../../../../../check/abilityService"
import {CheckType} from "../../../../../check/checkType"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {ActionType} from "../../../../enum/actionType"
import SpellBuilder from "../../../../spellBuilder"
import Spell from "../../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.WithstandDeath)
    .setAffectType(AffectType.WithstandDeath)
    .setActionType(ActionType.Defensive)
    .setCosts([ new ManaCost(80), new DelayCost(2) ])
    .setApplySpell((checkedRequest, affectBuilder) => affectBuilder
      .setTimeout(checkedRequest.mob.level / 8)
      .build())
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      const mob = checkedRequest.mob
      return new ResponseMessage(
        mob,
        SpellMessages.WithstandDeath.Success,
        { target: target === mob ? "you" : target,
          verb: target === mob ? "feel" : "feels" },
        { target: "you",
          verb: "feel" },
        { target,
          verb: "feels" })
    })
    .create()
}
