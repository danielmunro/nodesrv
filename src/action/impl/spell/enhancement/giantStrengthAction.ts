import {AffectType} from "../../../../affect/affectType"
import {newAffect} from "../../../../affect/factory"
import {newAttributesWithStats, newStats} from "../../../../attributes/factory"
import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import Cost from "../../../../check/cost/cost"
import {CostType} from "../../../../check/cost/costType"
import {Mob} from "../../../../mob/model/mob"
import SpecializationLevel from "../../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../../mob/specialization/specializationType"
import ResponseMessage from "../../../../request/responseMessage"
import {Messages} from "../../../../spell/action/constants"
import {SpellType} from "../../../../spell/spellType"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../../spell"

export default class GiantStrengthAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const [ target, spell ] = checkedRequest.results(CheckType.HasTarget, CheckType.HasSpell)
    const bonus = Math.ceil(spell.level / 2)
    target.addAffect(
      newAffect(
        AffectType.GiantStrength,
        spell.level,
        newAttributesWithStats(newStats(bonus, 0, 0, 0, 0, 0))))
  }

  public getSpellType(): SpellType {
    return SpellType.GiantStrength
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Mage) {
      return new SpecializationLevel(SpecializationType.Mage, 11)
    } else if (specializationType === SpecializationType.Cleric) {
      return new SpecializationLevel(SpecializationType.Cleric, 22)
    }
    return new SpecializationLevel(SpecializationType.Noop, 1)
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
      Messages.GiantStrength.Success,
      { target: target === checkedRequest.mob ? "your" : `${target.name}'s` },
      { target: "your" },
      { target: `${target.name}'s` })
  }
}
