import {AffectType} from "../../../../affect/enum/affectType"
import {newAffect} from "../../../../affect/factory/affectFactory"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import AbilityService from "../../../../check/service/abilityService"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {SkillType} from "../../../../mob/skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {Messages} from "../../../constants"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.ShieldBash)
    .setActionType(ActionType.Offensive)
    .setAffectType(AffectType.Stunned)
    .setTouchesTarget()
    .setCosts([
      new MvCost((mob: MobEntity) => Math.max(80, mob.mv / 2)),
      new DelayCost(2),
    ])
    .setApplySkill(requestService => {
      const target = requestService.getTarget<MobEntity>()
      const affect = target.affect()
      affect.add(newAffect(AffectType.Stunned, requestService.getMobLevel() / 10))
      affect.remove(AffectType.Haste)
      target.mv = target.mv / 2
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
