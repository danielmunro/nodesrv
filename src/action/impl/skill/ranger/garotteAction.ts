import {AffectType} from "../../../../affect/enum/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import MvCost from "../../../../check/cost/mvCost"
import {Disposition} from "../../../../mob/enum/disposition"
import {Costs} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ConditionMessages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Garotte)
    .setActionType(ActionType.SneakAttack)
    .setAffectType(AffectType.Sleep)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setTouchesTarget()
    .setCosts([
      new MvCost(Costs.Garotte.Mv),
      new ManaCost(Costs.Garotte.Mana),
      new DelayCost(Costs.Garotte.Delay),
    ])
    .setApplySkill(async (requestService, affectBuilder) => {
      requestService.setMobDisposition(Disposition.Sleeping)
      return affectBuilder
        .setTimeout(Math.max(1, requestService.getMobLevel() / 12))
        .build()
      })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(ConditionMessages.Garotte.Success)
        .setVerbToRequestCreator("passes")
        .setVerbToTarget("pass")
        .setVerbToObservers("passes")
        .create())
    .setFailMessage(requestService =>
      requestService.createResponseMessage(ConditionMessages.Garotte.Fail)
        .setVerbToRequestCreator("fail")
        .setVerbToTarget("fails")
        .setVerbToObservers("fails")
        .create())
    .create()
}
