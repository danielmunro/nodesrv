import {AffectType} from "../../../affect/affectType"
import {newAffect} from "../../../affect/factory"
import {newAttributes, newHitroll, newStats, newVitals} from "../../../attributes/factory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import {Mob} from "../../../mob/model/mob"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import ResponseMessage from "../../../request/responseMessage"
import {Messages} from "../../../spell/action/constants"
import {SpellType} from "../../../spell/spellType"
import {ActionType} from "../../enum/actionType"
import Spell from "../../spell"

export default class CurseAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
    target.addAffect(newAffect(
      AffectType.Curse,
      checkedRequest.mob.level / 10,
      newAttributes(
        newVitals(0, 0, 0),
        newStats(-1, -1, -1, -1, -1, -1),
        newHitroll(1, -4))))
  }

  public getSpellType(): SpellType {
    return SpellType.Curse
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Mage) {
      return new SpecializationLevel(SpecializationType.Mage, 18)
    }
    return new SpecializationLevel(SpecializationType.Noop, 1)
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
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
      Messages.Curse.Success,
      { target, verb: "is" },
      { target: "you", verb: "are" },
      { target, verb: "is" })
  }
}
