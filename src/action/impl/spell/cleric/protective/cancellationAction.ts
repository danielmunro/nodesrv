import {AffectType} from "../../../../../affect/affectType"
import {Affect} from "../../../../../affect/model/affect"
import CheckedRequest from "../../../../../check/checkedRequest"
import {CheckType} from "../../../../../check/checkType"
import Cost from "../../../../../check/cost/cost"
import {CostType} from "../../../../../check/cost/costType"
import {percentRoll} from "../../../../../random/helpers"
import ResponseMessage from "../../../../../request/responseMessage"
import {ConditionMessages} from "../../../../../skill/constants"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"

const CHANCE_THRESHOLD = 80

export default class CancellationAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    target.affects.forEach((affect: Affect) => {
      if (percentRoll() < CHANCE_THRESHOLD) {
        target.removeAffect(affect.affectType)
      }
    })
  }

  public getAffectType(): AffectType {
    return AffectType.Cancellation
  }

  public getSpellType(): SpellType {
    return SpellType.Cancellation
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mana, 10, ConditionMessages.All.NotEnoughMana),
    ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.Cancel.Success,
      {
        target: target === checkedRequest.mob ? "you" : target,
        verb: target === checkedRequest.mob ? "feel" : "feels",
      },
      { target: "you", verb: "feel" },
      { target, verb: "feels" })
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
