import AffectBuilder from "../../../../affect/affectBuilder"
import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import ResponseMessage from "../../../../request/responseMessage"
import {Costs, SkillMessages} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Berserk)
    .setActionType(ActionType.Defensive)
    .setAffectType(AffectType.Berserk)
    .setCosts([
      new MvCost(Costs.Berserk.Mv),
      new DelayCost(Costs.Berserk.Delay),
    ])
    .setApplySkill(checkedRequest =>
      Promise.resolve(new AffectBuilder(AffectType.Berserk)
        .setLevel(checkedRequest.mob.level)
        .setTimeout(Math.min(1, checkedRequest.mob.level / 10))
        .build()))
    .setSuccessMessage(checkedRequest => {
      const mob = checkedRequest.mob
      return new ResponseMessage(
        mob,
        SkillMessages.Berserk.Success,
        { requestCreator: "your", requestCreator2: "you" },
        { requestCreator2: "they" },
        { requestCreator: `${mob.name}'s`, requestCreator2: "they" })
    })
    .setFailMessage(checkedRequest =>
      new ResponseMessage(
        checkedRequest.mob,
        SkillMessages.Berserk.Fail).onlySendToRequestCreator())
    .create()
}
