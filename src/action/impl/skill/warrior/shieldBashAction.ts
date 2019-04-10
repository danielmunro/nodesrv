import {AffectType} from "../../../../affect/affectType"
import {newAffect} from "../../../../affect/factory"
import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
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
    .setApplySkill(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
      const affect = target.affect()
      affect.add(newAffect(AffectType.Stunned, checkedRequest.mob.level / 10))
      affect.remove(AffectType.Haste)
      target.vitals.mv = target.vitals.mv / 2
      return Promise.resolve()
    })
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        Messages.ShieldBash.Success,
        {
          requestCreator2: "your",
          target,
          verb: "smack",
        },
        {
          requestCreator2: "their",
          target: "you",
          verb: "smacks",
        },
        {
          requestCreator2: "their",
          target,
          verb: "smacks",
        })
    })
    .setFailMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        Messages.ShieldBash.Fail,
        {
          requestCreator: "you",
          target,
          verb: "attempt",
          verb2: "fail",
        },
        {
          requestCreator: checkedRequest.mob,
          target: "you",
          verb: "attempts",
          verb2: "fails",
        },
        {
          requestCreator: checkedRequest.mob,
          target,
          verb: "attempts",
          verb2: "fails",
        })
    })
    .create()
}
