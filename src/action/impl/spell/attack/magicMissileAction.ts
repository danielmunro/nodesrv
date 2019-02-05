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

export default class MagicMissileAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    target.vitals.hp -= roll(1, 4)
  }

  public getSpellType(): SpellType {
    return SpellType.MagicMissile
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Mage) {
      return new SpecializationLevel(SpecializationType.Mage, 1)
    }
    return new SpecializationLevel(SpecializationType.Noop, 1)
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mana, 15),
    ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      Messages.MagicMissile.Success,
      { target, verb: "is" },
      { verb: "are" },
      { target, verb: "is" })
  }
}
