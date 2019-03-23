import {AffectType} from "../../../../../affect/affectType"
import AbilityService from "../../../../../check/abilityService"
import CheckComponent from "../../../../../check/checkComponent"
import {CheckType} from "../../../../../check/checkType"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import {Mob} from "../../../../../mob/model/mob"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../spell"
import SpellBuilder from "../../spellBuilder"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.RemoveCurse)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setApplySpell(async checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
      target.affects = target.affects.filter(affect => affect.affectType !== AffectType.Curse)
    })
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
      const mob = checkedRequest.mob
      return new ResponseMessage(
        checkedRequest.mob,
        SpellMessages.RemoveCurse.Success,
        { target: target === mob ? "your" : target + "'s" },
        { target: "your" },
        { target: target + "'s" })
    })
    .setCheckBuilder((request, checkBuilder) => {
      const affect = request.getTargetMobInRoom().getAffect(AffectType.Curse)
      checkBuilder.addCheck(new CheckComponent(
        CheckType.HasSpell,
        true,
        !!affect,
        SpellMessages.RemoveCurse.RequiresAffect))
    })
    .create()
}
