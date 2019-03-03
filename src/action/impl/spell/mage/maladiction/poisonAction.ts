import {AffectType} from "../../../../../affect/affectType"
import {newAffect} from "../../../../../affect/factory"
import {newAttributesWithHitrollStats, newHitroll, newStats} from "../../../../../attributes/factory"
import CheckedRequest from "../../../../../check/checkedRequest"
import {CheckType} from "../../../../../check/checkType"
import Cost from "../../../../../check/cost/cost"
import {CostType} from "../../../../../check/cost/costType"
import {Mob} from "../../../../../mob/model/mob"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"

export default class PoisonAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const [ target, spell ] = checkedRequest.results(CheckType.HasTarget, CheckType.HasSpell)
    target.addAffect(
      newAffect(
        AffectType.Poison,
        spell.level / 2,
        newAttributesWithHitrollStats(newHitroll(0, -1), newStats(-1, 0, 0, 0, -1, -1))))
  }

  public getSpellType(): SpellType {
    return SpellType.Poison
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mana, 20),
    ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
    return new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.Poison.Success,
      { target, verb: "feels" },
      { target: "you", verb: "feel" },
      { target, verb: "feels" })
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
