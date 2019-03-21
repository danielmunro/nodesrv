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
    .setSpellType(SpellType.WithstandDeath)
    .setAffectType(AffectType.WithstandDeath)
    .setActionType(ActionType.Defensive)
    .setCosts([ new ManaCost(80), new DelayCost(2) ])
    .setCreateAffect((checkedRequest, affectBuilder) => affectBuilder
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
