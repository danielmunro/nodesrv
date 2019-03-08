import {AffectType} from "../../../../affect/affectType"
import {newAffect} from "../../../../affect/factory"
import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import {CheckMessages as CheckMessages} from "../../../../check/constants"
import Cost from "../../../../check/cost/cost"
import {CostType} from "../../../../check/cost/costType"
import {RequestType} from "../../../../request/requestType"
import ResponseMessage from "../../../../request/responseMessage"
import {Costs, SkillMessages, Thresholds} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {Messages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../../skill"

export default class BerserkAction extends Skill {
  public roll(checkedRequest: CheckedRequest): boolean {
    return this.getSkillRoll(
      checkedRequest.mob,
      checkedRequest.getCheckTypeResult(CheckType.HasSkill)) > Thresholds.Berserk
  }

  public applySkill(checkedRequest: CheckedRequest): void {
    checkedRequest.mob.addAffect(newAffect(AffectType.Berserk, checkedRequest.mob.level / 10))
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return new ResponseMessage(
      checkedRequest.mob,
      SkillMessages.Berserk.Fail)
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const mob = checkedRequest.mob
    return new ResponseMessage(
      mob,
      SkillMessages.Berserk.Success,
      { requestCreator: "your", requestCreator2: "you" },
      { requestCreator2: "they" },
      { requestCreator: `${mob.name}'s`, requestCreator2: "they" })
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Delay, Costs.Berserk.Delay),
      new Cost(CostType.Mv, mob =>
        Math.max(mob.getCombinedAttributes().vitals.mv / 2, Costs.Berserk.Mv), CheckMessages.TooTired),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Berserk
  }

  public getAffectType(): AffectType {
    return AffectType.Berserk
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ActionPart.Action]
  }

  public getRequestType(): RequestType {
    return RequestType.Berserk
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
