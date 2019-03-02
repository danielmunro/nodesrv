import {AffectType} from "../../../../affect/affectType"
import {newAffect} from "../../../../affect/factory"
import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import Cost from "../../../../check/cost/cost"
import {CostType} from "../../../../check/cost/costType"
import {Mob} from "../../../../mob/model/mob"
import SpecializationLevel from "../../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../../mob/specialization/specializationType"
import {percentRoll} from "../../../../random/dice"
import {RequestType} from "../../../../request/requestType"
import ResponseMessage from "../../../../request/responseMessage"
import {SkillType} from "../../../../skill/skillType"
import {Messages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../../skill"

export default class ShieldBashAction extends Skill {
  public applySkill(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
    target.addAffect(newAffect(AffectType.Stunned, checkedRequest.mob.level / 10))
    target.removeAffect(AffectType.Haste)
    target.vitals.mv = target.vitals.mv / 2
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Hostile]
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mv, (mob: Mob) => Math.max(80, mob.vitals.mv / 2)),
      new Cost(CostType.Delay, 2),
    ]
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
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
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
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
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.ShieldBash
  }

  public getSkillType(): SkillType {
    return SkillType.ShieldBash
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(specializationType, 18)
    }
    return new SpecializationLevel(SpecializationType.Noop, 1)
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    return percentRoll() < skill.level
  }
}
