import {AffectType} from "../../../../../affect/affectType"
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
import SpellBuilder from "../../spellBuilder"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.CurePoison)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setApplySpell(async checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
      target.affects = target.affects.filter(affect => affect.affectType !== AffectType.Poison)
    })
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
      const mob = checkedRequest.mob
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.CurePoison.Success,
        { target: target === mob ? "you" : target, verb: target === mob ? "feel" : "feels" },
        { verb: "feel" },
        { target, verb: "feels" })
    })
    .create()
}
