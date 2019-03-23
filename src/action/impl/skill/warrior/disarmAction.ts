import Check from "../../../../check/check"
import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import Cost from "../../../../check/cost/cost"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {Equipment} from "../../../../item/equipment"
import {Item} from "../../../../item/model/item"
import {Mob} from "../../../../mob/model/mob"
import roll from "../../../../random/dice"
import {Request} from "../../../../request/request"
import {RequestType} from "../../../../request/requestType"
import ResponseMessage from "../../../../request/responseMessage"
import {ActionMessages, ConditionMessages as PreconditionMessages, Costs, Thresholds} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {Messages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../../skill"

export default class DisarmAction extends Skill {
  /* tslint:disable */
  public async check(request: Request): Promise<Check> {
    return this.abilityService.createCheckTemplate(request)
      .perform(this)
      .require(
        (_: any, target: Mob) => target.equipped.find((i: Item) => i.equipment === Equipment.Weapon),
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

  public getCosts(): Cost[] {
    return [
      new MvCost(Costs.Disarm.Mv),
      new DelayCost(Costs.Disarm.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Disarm
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Target]
  }

  public getRequestType(): RequestType {
    return RequestType.Disarm
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
