import {AffectType} from "../../../../../affect/affectType"
import {newAffect} from "../../../../../affect/factory"
import {newAttributes, newHitroll, newStats, newVitals} from "../../../../../attributes/factory"
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
      SpellMessages.Curse.Success,
      { target, verb: "is" },
      { target: "you", verb: "are" },
      { target, verb: "is" })
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
