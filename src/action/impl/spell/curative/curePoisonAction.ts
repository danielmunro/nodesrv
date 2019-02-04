import {AffectType} from "../../../../affect/affectType"
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

export default class CurePoisonAction extends Spell {
  public applySpell(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Mob
    target.affects = target.affects.filter(affect => affect.affectType !== AffectType.Poison)
  }

  public getSpellType(): SpellType {
    return SpellType.CurePoison
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Cleric) {
      return new SpecializationLevel(SpecializationType.Cleric, 13)
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
    const mob = checkedRequest.mob
    return new ResponseMessage(
      checkedRequest.mob,
      Messages.CurePoison.Success,
      { target: target === mob ? "you" : target, verb: target === mob ? "feel" : "feels" },
      { verb: "feel" },
      { target, verb: "feels" })
  }
}
