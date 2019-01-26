import {AffectType} from "../../../affect/affectType"
import {newAffect} from "../../../affect/factory"
import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import {DamageType} from "../../../damage/damageType"
import Weapon from "../../../item/model/weapon"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {Costs} from "../../../skill/constants"
import {Messages} from "../../../skill/constants"
import {ConditionMessages as PreconditionMessages} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class EnvenomAction extends Skill {
  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckTemplate(request)
      .perform(this)
      .require(
        request.findItemInSessionMobInventory(),
        PreconditionMessages.All.NoItem,
        CheckType.HasItem)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    const responseBuilder = checkedRequest.respondWith()

    if (!(item instanceof Weapon)) {
      return responseBuilder.error(Messages.Envenom.Error.NotAWeapon)
    }

    if (item.damageType !== DamageType.Slash && item.damageType !== DamageType.Pierce) {
      return responseBuilder.error(Messages.Envenom.Error.WrongWeaponType)
    }

    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    const mob = checkedRequest.mob

    if (roll(1, skill.level / 3) <= item.level) {
      return responseBuilder.fail(Messages.Envenom.Fail, { item })
    }

    mob.vitals.mana -= Costs.Envenom.Mana
    item.affects.push(newAffect(AffectType.Poison, mob.level))

    return responseBuilder.success(Messages.Envenom.Success, { item })
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
