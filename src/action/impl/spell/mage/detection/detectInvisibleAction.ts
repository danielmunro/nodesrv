import {AffectType} from "../../../../../affect/affectType"
import CheckedRequest from "../../../../../check/checkedRequest"
import {CheckType} from "../../../../../check/checkType"
import Cost from "../../../../../check/cost/cost"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"

export default class DetectInvisibleAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    this.applyAffectType(checkedRequest)
  }

  public getAffectType(): AffectType {
    return AffectType.DetectInvisible
  }

  public getSpellType(): SpellType {
    return SpellType.DetectInvisible
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getCosts(): Cost[] {
    return [
      new ManaCost(20),
      new DelayCost(1),
    ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.DetectInvisible.Success,
      { target: target === checkedRequest.mob ? "your" : `${target}'s` },
      { target: "your" },
      { target: `${target}'s` })
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
