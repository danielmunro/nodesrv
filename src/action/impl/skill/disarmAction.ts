import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {Messages as CheckMessages} from "../../../check/constants"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import {Equipment} from "../../../item/equipment"
import {Item} from "../../../item/model/item"
import {Mob} from "../../../mob/model/mob"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import ResponseMessage from "../../../request/responseMessage"
import {ActionMessages, ConditionMessages as PreconditionMessages, Costs, Thresholds} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class DisarmAction extends Skill {
  /* tslint:disable */
  public async check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckTemplate(request)
      .perform(this)
      .require(
        (mob: Mob, target: Mob) => target.equipped.find((i: Item) => i.equipment === Equipment.Weapon),
        PreconditionMessages.Disarm.FailNothingToDisarm,
        CheckType.ItemPresent)
      .create()
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const [ skill, target ] = checkedRequest.results(CheckType.HasSkill, CheckType.HasTarget)
    return roll(4, (Math.max(1, checkedRequest.mob.level - target.level) + skill.level) / 2) < Thresholds.Disarm
  }

  public applySkill(checkedRequest: CheckedRequest): void {
    const item = checkedRequest.getCheckTypeResult(CheckType.ItemPresent)
    checkedRequest.room.inventory.addItem(item)
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      ActionMessages.Disarm.Failure,
      { target, verb: "fail" },
      { target: "you", verb: "fails" },
      { target, verb: "fails" })
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      ActionMessages.Disarm.Success,
      { target, gender: target.gender, verb: "disarm", verb2: "send" },
      { target: "you", gender: "your", verb: "disarms", verb2: "sends" },
      { target, gender: target.gender, verb: "disarms", verb2: "sends" })
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 11)
    } else if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 12)
    }

    return new SpecializationLevel(SpecializationType.Noop, 1)
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mv, Costs.Disarm.Mv, CheckMessages.TooTired),
      new Cost(CostType.Delay, Costs.Disarm.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Disarm
  }

  protected getRequestType(): RequestType {
    return RequestType.Disarm
  }
}
