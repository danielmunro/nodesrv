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
import ResponseMessage from "../../../request/responseMessage"
import {ConditionMessages as ConditionMessages, Costs, Messages} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class BashAction extends Skill {
  public applySkill(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    target.affects.push(newAffect(AffectType.Stunned, 1))
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const [ skill, target ] = checkedRequest.results(CheckType.HasSkill, CheckType.HasTarget)
    return roll(1, skill.level) - roll(1, target.getCombinedAttributes().stats.dex * 3) > 0
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      Messages.Bash.Success,
      { target, verb: "slam", verb2: "send", target2: "them" },
      { target: "you", verb: "slams", verb2: "sends", target2: "you" },
      {target, verb: "slams", verb2: "sends", target2: "them"})
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const mob = checkedRequest.mob
    return new ResponseMessage(
      mob,
      Messages.Bash.Fail,
      { requestCreator: "you", verb: "fall", requestCreator2: "your"},
      { requestCreator: mob, verb: "falls", requestCreator2: "their"})
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
