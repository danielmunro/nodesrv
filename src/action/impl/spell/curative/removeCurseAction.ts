import {AffectType} from "../../../../affect/enum/affectType"
import CheckComponent from "../../../../check/builder/checkComponent"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {CheckType} from "../../../../check/enum/checkType"
import AbilityService from "../../../../check/service/abilityService"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
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
      const target = requestService.getResult(CheckType.HasTarget) as MobEntity
      target.affects = target.affects.filter(affect => affect.affectType !== AffectType.Curse)
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.RemoveCurse.Success)
        .setPluralizeTarget()
        .setTargetPossessive()
        .create())
    .addToCheckBuilder((request, checkBuilder) => {
      const affect = request.getTargetMobInRoom().affect().get(AffectType.Curse).get()
      checkBuilder.addCheck(new CheckComponent(
        CheckType.HasSpell,
        true,
        !!affect,
        SpellMessages.RemoveCurse.RequiresAffect))
    })
    .setSpecializationType(SpecializationType.Cleric)
    .create()
}
