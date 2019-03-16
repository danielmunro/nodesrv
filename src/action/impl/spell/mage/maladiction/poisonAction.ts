import AffectBuilder from "../../../../../affect/affectBuilder"
import {AffectType} from "../../../../../affect/affectType"
import AttributeBuilder from "../../../../../attributes/attributeBuilder"
import {newHitroll, newStats} from "../../../../../attributes/factory"
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

export default class PoisonAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const [ target, spell ] = checkedRequest.results(CheckType.HasTarget, CheckType.HasSpell)
    target.addAffect(
      new AffectBuilder(AffectType.Poison)
        .setLevel(spell.level / 2)
        .setAttributes(new AttributeBuilder()
          .setHitRoll(newHitroll(0, -1))
          .setStats(newStats(-1, 0, 0, 0, -1, -1))
          .build())
        .build())
  }

  public getSpellType(): SpellType {
    return SpellType.Poison
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getCosts(): Cost[] {
    return [
      new ManaCost(20),
      new DelayCost(1),
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
