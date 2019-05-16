import {AffectType} from "../../../../affect/enum/affectType"
import {newAffect} from "../../../../affect/factory"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {Mob} from "../../../../mob/model/mob"
import ResponseMessage from "../../../../request/responseMessage"
import {SkillType} from "../../../../skill/skillType"
import {Messages} from "../../../constants"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.ShieldBash)
    .setActionType(ActionType.Offensive)
    .setAffectType(AffectType.Stunned)
    .setTouchesTarget()
    .setCosts([
      new MvCost((mob: Mob) => Math.max(80, mob.vitals.mv / 2)),
      new DelayCost(2),
    ])
    .setApplySkill(requestService => {
      const target = requestService.getTarget()
      const affect = target.affect()
      affect.add(newAffect(AffectType.Stunned, requestService.getMobLevel() / 10))
      affect.remove(AffectType.Haste)
      target.vitals.mv = target.vitals.mv / 2
      return Promise.resolve()
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(Messages.ShieldBash.Success)
        .setVerbToRequestCreator("smack")
        .addReplacementForRequestCreator("requestCreator2", "your")
        .setVerbToTarget("smacks")
        .addReplacementForTarget("requestCreator2", "their")
        .setVerbToObservers("smacks")
        .addReplacementForObservers("requestCreator2", "their")
        .create())
    .setFailMessage(requestService =>
      requestService.createResponseMessage(Messages.ShieldBash.Fail)
        .setVerbToRequestCreator("attempt")
        .addReplacementForRequestCreator("verb2", "fail")
        .setVerbToTarget("attempts")
        .addReplacementForTarget("verb2", "fails")
        .setVerbToObservers("attempts")
        .addReplacementForObservers("verb2", "fails")
        .create())
    .create()
}
