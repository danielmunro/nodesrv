import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import Cost from "../../../../check/cost/cost"
import {CostType} from "../../../../check/cost/costType"
import SpecializationLevel from "../../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../../mob/specialization/specializationType"
import roll from "../../../../random/dice"
import ResponseMessage from "../../../../request/responseMessage"
import {Messages} from "../../../../spell/action/constants"
import {SpellType} from "../../../../spell/spellType"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../../spell"

export default class HealAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    target.vitals.hp += roll(20, 4)
  }

  public getSpellType(): SpellType {
    return SpellType.Heal
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
      new Cost(CostType.Mana, 50),
    ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      Messages.Heal.Success,
      { target: target === checkedRequest.mob ? "you" : target, verb: "is" },
      { target: "you", verb: "are" },
      { target, verb: "is" })
  }
}