import AffectBuilder from "../../../../../affect/affectBuilder"
import {AffectType} from "../../../../../affect/affectType"
import CheckedRequest from "../../../../../check/checkedRequest"
import {CheckType} from "../../../../../check/checkType"
import Cost from "../../../../../check/cost/cost"
import ManaCost from "../../../../../check/cost/manaCost"
import DamageSourceBuilder from "../../../../../mob/damageSourceBuilder"
import {Mob} from "../../../../../mob/model/mob"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"

export default class TowerOfIronWillAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
    target.affects.push(
      new AffectBuilder(AffectType.TowerOfIronWill)
        .setLevel(checkedRequest.mob.level / 7)
        .setResist(new DamageSourceBuilder().enableMental().get())
        .build())
  }

  public getAffectType(): AffectType {
    return AffectType.TowerOfIronWill
  }

  public getSpellType(): SpellType {
    return SpellType.TowerOfIronWill
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getCosts(): Cost[] {
    return [ new ManaCost(20) ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.TowerOfIronWill.Success,
      { target: target === checkedRequest.mob ? "your" : `${target}'s` },
      { target: "your" },
      { target: `${target}'s` })
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
