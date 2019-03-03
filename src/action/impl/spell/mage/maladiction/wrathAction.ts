import {AffectType} from "../../../../../affect/affectType"
import {newAffect} from "../../../../../affect/factory"
import {newAttributes, newHitroll, newStats, newVitals} from "../../../../../attributes/factory"
import CheckedRequest from "../../../../../check/checkedRequest"
import {CheckType} from "../../../../../check/checkType"
import Cost from "../../../../../check/cost/cost"
import {CostType} from "../../../../../check/cost/costType"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"

export default class WrathAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    target.addAffect(newAffect(
      AffectType.Wrath,
      checkedRequest.mob.level,
      newAttributes(
        newVitals(20 * (checkedRequest.mob.level / 10), 0, 0),
        newStats(1, -2, -2, 1, 1, 0),
        newHitroll(1, 2))))
  }

  public getSpellType(): SpellType {
    return SpellType.Wrath
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mana, 35),
    ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.Wrath.Success,
      { target, verb: "is" },
      { verb: "are" },
      { target, verb: "is" })
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
