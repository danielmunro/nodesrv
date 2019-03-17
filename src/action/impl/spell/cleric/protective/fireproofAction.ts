import AffectBuilder from "../../../../../affect/affectBuilder"
import {AffectType} from "../../../../../affect/affectType"
import CheckedRequest from "../../../../../check/checkedRequest"
import {CheckType} from "../../../../../check/checkType"
import Cost from "../../../../../check/cost/cost"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import {Mob} from "../../../../../mob/model/mob"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"

export default class FireproofAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
    target.addAffect(new AffectBuilder(AffectType.Fireproof)
      .setLevel(checkedRequest.mob.level)
      .setTimeout(checkedRequest.mob.level / 8)
      .build())
  }

  public getAffectType(): AffectType {
    return AffectType.Fireproof
  }

  public getSpellType(): SpellType {
    return SpellType.Fireproof
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getCosts(): Cost[] {
    return [
      new ManaCost(10),
      new DelayCost(1),
    ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.Fireproof.Success,
      { target })
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
