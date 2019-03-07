import {AffectType} from "../../../../../affect/affectType"
import Check from "../../../../../check/check"
import CheckedRequest from "../../../../../check/checkedRequest"
import {CheckType} from "../../../../../check/checkType"
import Cost from "../../../../../check/cost/cost"
import {CostType} from "../../../../../check/cost/costType"
import {Mob} from "../../../../../mob/model/mob"
import {Request} from "../../../../../request/request"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"

export default class RemoveCurseAction extends Spell {
  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckTemplate(request)
      .cast(this)
      .requireAffect(AffectType.Curse, SpellMessages.RemoveCurse.RequiresAffect)
      .create()
  }

  public applySpell(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
    target.affects = target.affects.filter(affect => affect.affectType !== AffectType.Curse)
  }

  public getSpellType(): SpellType {
    return SpellType.RemoveCurse
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mana, 20),
    ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
    const mob = checkedRequest.mob
    return new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.RemoveCurse.Success,
      { target: target === mob ? "your" : target + "'s" },
      { target: "your" },
      { target: target + "'s" })
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
