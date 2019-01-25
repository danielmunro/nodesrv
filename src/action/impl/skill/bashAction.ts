import {AffectType} from "../../../affect/affectType"
import {newAffect} from "../../../affect/factory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {Messages} from "../../../skill/constants"
import {Costs} from "../../../skill/constants"
import {Messages as ConditionMessages} from "../../../skill/precondition/constants"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class BashAction extends Skill {
  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const mob = checkedRequest.mob
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    const skill = mob.skills.find(s => s.skillType === SkillType.Bash)

    if (roll(1, skill.level) - roll(1, target.getCombinedAttributes().stats.dex * 3) < 0) {
      return checkedRequest.respondWith().fail(
        Messages.Bash.Fail,
        { requestCreator: "you", verb: "fall", requestCreator2: "your"},
        { requestCreator: mob, verb: "falls", requestCreator2: "their"})
    }

    target.vitals.hp--
    target.addAffect(newAffect(AffectType.Stunned))

    return checkedRequest.respondWith().success(
      Messages.Bash.Success,
      { target, verb: "slam", verb2: "send", target2: "them" },
      { target: "you", verb: "slams", verb2: "sends", target2: "you" },
      {target, verb: "slams", verb2: "sends", target2: "them"})
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 1)
    }

    return new SpecializationLevel(SpecializationType.Noop, 1)
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mv, Costs.Bash.Mv, ConditionMessages.All.NotEnoughMv),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Bash
  }

  protected getRequestType(): RequestType {
    return RequestType.Bash
  }
}
