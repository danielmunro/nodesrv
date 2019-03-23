import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import Cost from "../../../../check/cost/cost"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {Fight} from "../../../../mob/fight/fight"
import roll from "../../../../random/dice"
import {RequestType} from "../../../../request/requestType"
import ResponseMessage from "../../../../request/responseMessage"
import {ActionMessages, Costs, Thresholds} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {Messages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default class BackstabAction extends Skill {
  public applySkill(checkedRequest: CheckedRequest): void {
    const mob = checkedRequest.mob
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    target.vitals.hp -= Fight.oneHit(mob, target)
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const [ skill, target ] = checkedRequest.results(CheckType.HasSkill, CheckType.HasTarget)
    return roll(3, skill.level / 3) +
      roll(2, Math.max(1, checkedRequest.mob.level - target.level)) > Thresholds.Backstab
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      ActionMessages.Backstab.Success,
      { target, verb: "backstab" },
      { verb: "backstabs" },
      { target, verb: "backstabs" })
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const mob = checkedRequest.mob
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      mob,
      ActionMessages.Backstab.Failure,
      { target, verb: "dodges", requestCreator: "your" },
      { verb: "dodge", requestCreator: `${mob.name}'s`},
      { target, verb: "dodges", requestCreator: `${mob.name}'s`})
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getCosts(): Cost[] {
    return [
      new MvCost(Costs.Backstab.Mv),
      new DelayCost(Costs.Backstab.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Backstab
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Hostile]
  }

  public getRequestType(): RequestType {
    return RequestType.Backstab
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
