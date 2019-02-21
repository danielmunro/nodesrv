import {AffectType} from "../../../affect/affectType"
import {newAffect} from "../../../affect/factory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {CheckMessages as CheckMessages} from "../../../check/constants"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {RequestType} from "../../../request/requestType"
import ResponseMessage from "../../../request/responseMessage"
import {Costs} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class HamstringAction extends Skill {
  public roll(checkedRequest: CheckedRequest): boolean {
    const [ skill, target ] = checkedRequest.results(CheckType.HasSkill, CheckType.HasTarget)
    return roll(1, skill.level) - target.level > checkedRequest.mob.level
  }

  public applySkill(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    target.affects.push(newAffect(AffectType.Immobilize, checkedRequest.mob.level / 15))
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      ConditionMessages.Hamstring.Fail,
      {verb: "attempt", target, verb2: "fail"},
      {verb: "attempts", target: "you", verb2: "fails"},
      {verb: "attempts", target, verb2: "fails"})
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      ConditionMessages.Hamstring.Success,
      {verb: "slice", target: `${target}'s`, target2: "They"},
      {verb: "slices", target: "your", target2: "You"},
      {verb: "slices", target: `${target}'s`, target2: "They"})
  }

  public getActionType(): ActionType {
    return ActionType.SneakAttack
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 31)
    }

    return new SpecializationLevel(SpecializationType.Noop, 1)
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mv, Costs.Hamstring.Mv, CheckMessages.TooTired),
      new Cost(CostType.Mana, Costs.Hamstring.Mana, CheckMessages.NotEnoughMana),
      new Cost(CostType.Delay, Costs.Hamstring.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Hamstring
  }

  public getAffectType(): AffectType {
    return AffectType.Immobilize
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Target]
  }

  public getRequestType(): RequestType {
    return RequestType.Hamstring
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
