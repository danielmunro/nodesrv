import {AffectType} from "../../../../affect/affectType"
import {newAffect} from "../../../../affect/factory"
import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import Cost from "../../../../check/cost/cost"
import {CostType} from "../../../../check/cost/costType"
import SpecializationLevel from "../../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../../mob/specialization/specializationType"
import ResponseMessage from "../../../../request/responseMessage"
import {ConditionMessages} from "../../../../skill/constants"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import {Messages} from "../../../constants"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../../spell"

export default class ShieldAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    target.addAffect(newAffect(AffectType.Shield, checkedRequest.mob.level))
  }

  public getAffectType(): AffectType {
    return AffectType.Shield
  }

  public getSpellType(): SpellType {
    return SpellType.Shield
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Cleric) {
      return new SpecializationLevel(SpecializationType.Cleric, 20)
    }
    return new SpecializationLevel(SpecializationType.Noop, 1)
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
      SpellMessages.Shield.Success,
      { target: target === checkedRequest.mob ? "you" : target, verb: "are" },
      { target: "you", verb: "are" },
      { target, verb: "is" })
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
