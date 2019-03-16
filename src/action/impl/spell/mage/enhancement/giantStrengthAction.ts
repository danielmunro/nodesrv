import AffectBuilder from "../../../../../affect/affectBuilder"
import {AffectType} from "../../../../../affect/affectType"
import AttributeBuilder from "../../../../../attributes/attributeBuilder"
import {newStats} from "../../../../../attributes/factory"
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

export default class GiantStrengthAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const [ target, spell ] = checkedRequest.results(CheckType.HasTarget, CheckType.HasSpell)
    const bonus = Math.ceil(spell.level / 2)
    target.addAffect(
      new AffectBuilder(AffectType.GiantStrength)
        .setLevel(spell.level)
        .setAttributes(new AttributeBuilder()
          .setStats(newStats(bonus, 0, 0, 0, 0, 0))
          .build())
        .build())
  }

  public getSpellType(): SpellType {
    return SpellType.GiantStrength
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
    return new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.GiantStrength.Success,
      { target: target === checkedRequest.mob ? "your" : `${target.name}'s` },
      { target: "your" },
      { target: `${target.name}'s` })
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
