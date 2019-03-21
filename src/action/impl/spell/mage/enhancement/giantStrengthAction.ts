import AffectBuilder from "../../../../../affect/affectBuilder"
import {AffectType} from "../../../../../affect/affectType"
import AttributeBuilder from "../../../../../attributes/attributeBuilder"
import {newStats} from "../../../../../attributes/factory"
import AbilityService from "../../../../../check/abilityService"
import {CheckType} from "../../../../../check/checkType"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import {Mob} from "../../../../../mob/model/mob"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"
import AffectSpellBuilder from "../../affectSpellBuilder"

export default function(abilityService: AbilityService): Spell {
  return new AffectSpellBuilder(abilityService)
    .setSpellType(SpellType.GiantStrength)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.GiantStrength.Success,
        { target: target === checkedRequest.mob ? "your" : `${target.name}'s` },
        { target: "your" },
        { target: `${target.name}'s` })
    })
    .setCreateAffect(checkedRequest => {
      return new AffectBuilder(AffectType.GiantStrength)
        .setLevel(checkedRequest.mob.level)
        .setAttributes(new AttributeBuilder()
          .setStats(newStats(checkedRequest.mob.level / 10, 0, 0, 0, 0, 0))
          .build())
        .build()
    })
    .create()
}
