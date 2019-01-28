import {AffectType} from "../../../affect/affectType"
import {newAffect} from "../../../affect/factory"
import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import {DamageType} from "../../../damage/damageType"
import {Equipment} from "../../../item/equipment"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import ResponseMessage from "../../../request/responseMessage"
import {ConditionMessages as PreconditionMessages, Costs, Messages} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class EnvenomAction extends Skill {
  public check(request: Request): Promise<Check> {
    const item = request.findItemInSessionMobInventory()
    return this.checkBuilderFactory.createCheckTemplate(request)
      .perform(this)
      .require(
        item,
        PreconditionMessages.All.NoItem,
        CheckType.HasItem)
      .capture(item)
      .require(captured => captured.equipment === Equipment.Weapon, Messages.Envenom.Error.NotAWeapon)
      .require(captured => captured.damageType === DamageType.Slash || captured.damageType === DamageType.Pierce,
        Messages.Envenom.Error.WrongWeaponType)
      .create()
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const [ skill, item ] = checkedRequest.results(CheckType.HasSkill, CheckType.HasItem)
    return roll(1, skill.level / 3) > item.level
  }

  public applySkill(checkedRequest: CheckedRequest): void {
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    item.affects.push(newAffect(AffectType.Poison, checkedRequest.mob.level))
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    return new ResponseMessage(
      checkedRequest.mob,
      Messages.Envenom.Success,
      { item })
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    return new ResponseMessage(
      checkedRequest.mob,
      Messages.Envenom.Fail,
      { item })
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 1)
    } else if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 15)
    }

    return new SpecializationLevel(SpecializationType.Noop, 1)
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mana, Costs.Envenom.Mana),
      new Cost(CostType.Delay, Costs.Envenom.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Envenom
  }

  public getAffectType(): AffectType {
    return AffectType.Poison
  }

  protected getRequestType(): RequestType {
    return RequestType.Envenom
  }
}
