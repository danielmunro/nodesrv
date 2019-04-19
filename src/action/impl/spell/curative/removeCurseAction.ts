import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import CheckComponent from "../../../../check/checkComponent"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {Mob} from "../../../../mob/model/mob"
import ResponseMessage from "../../../../request/responseMessage"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import {ActionType} from "../../../enum/actionType"
import SpellBuilder from "../../../spellBuilder"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.RemoveCurse)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setApplySpell(async requestService => {
      const target = requestService.getResult(CheckType.HasTarget) as Mob
      target.affects = target.affects.filter(affect => affect.affectType !== AffectType.Curse)
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.RemoveCurse.Success)
        .setPluralizeTarget()
        .setTargetPossessive()
        .create())
    .addToCheckBuilder((request, checkBuilder) => {
      const affect = request.getTargetMobInRoom().affect().get(AffectType.Curse)
      checkBuilder.addCheck(new CheckComponent(
        CheckType.HasSpell,
        true,
        !!affect,
        SpellMessages.RemoveCurse.RequiresAffect))
    })
    .create()
}
