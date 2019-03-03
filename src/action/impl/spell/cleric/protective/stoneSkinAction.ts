import {AffectType} from "../../../../../affect/affectType"
import CheckedRequest from "../../../../../check/checkedRequest"
import {CheckType} from "../../../../../check/checkType"
import Cost from "../../../../../check/cost/cost"
import {CostType} from "../../../../../check/cost/costType"
import ResponseMessage from "../../../../../request/responseMessage"
import {ConditionMessages} from "../../../../../skill/constants"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"

export default class StoneSkinAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    this.applyAffectType(checkedRequest)
  }

  public getAffectType(): AffectType {
    return AffectType.StoneSkin
  }

  public getSpellType(): SpellType {
    return SpellType.StoneSkin
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mana, 12, ConditionMessages.All.NotEnoughMana),
    ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.StoneSkin.Success,
      { target: target === checkedRequest.mob ? "your" : `${target.name}'s` },
      { target: "your" },
      { target: `${target.name}'s` })
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
