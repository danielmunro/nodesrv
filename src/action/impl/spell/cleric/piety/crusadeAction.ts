import AffectBuilder from "../../../../../affect/affectBuilder"
import {AffectType} from "../../../../../affect/affectType"
import AttributeBuilder from "../../../../../attributes/attributeBuilder"
import {newHitroll} from "../../../../../attributes/factory"
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

export default class CrusadeAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    target.addAffect(
      new AffectBuilder(AffectType.Crusade)
        .setTimeout(checkedRequest.mob.level / 8)
        .setLevel(checkedRequest.mob.level)
        .setAttributes(new AttributeBuilder()
          .setHitRoll(newHitroll(1, checkedRequest.mob.level / 8))
          .build())
        .build())
  }

  public getAffectType(): AffectType {
    return AffectType.Crusade
  }

  public getSpellType(): SpellType {
    return SpellType.Crusade
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mana, 20, ConditionMessages.All.NotEnoughMana),
    ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.Crusade.Success,
      {
        target: target === checkedRequest.mob ? "you" : target,
        verb: target === checkedRequest.mob ? "are" : "is",
      },
      { target: "you", verb: "are" },
      { target, verb: "is" })
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
