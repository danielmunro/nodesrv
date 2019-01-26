import Skill from "../../../action/skill"
import {AffectType} from "../../../affect/affectType"
import {newPermanentAffect} from "../../../affect/factory"
import {newAttributesWithHitroll, newHitroll} from "../../../attributes/factory"
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
import {ActionMessages} from "../../../skill/constants"
import {Costs, Thresholds} from "../../../skill/constants"
import {ConditionMessages as PreconditionMessages} from "../../../skill/constants"
import {Skill as SkillModel} from "../../../skill/model/skill"
import {SkillType} from "../../../skill/skillType"
import collectionSearch from "../../../support/matcher/collectionSearch"
import {ActionType} from "../../enum/actionType"

export default class SharpenAction extends Skill {
  private static calculateSharpenSaves(skill: SkillModel) {
    return roll(1, skill.level / 10)
  }

  public check(request: Request): Promise<Check> {
    const item = collectionSearch(request.mob.inventory.items, request.getSubject())

    return this.checkBuilderFactory.createCheckTemplate(request)
      .perform(this)
      .not().requireFight(PreconditionMessages.All.Fighting)
      .require(item, PreconditionMessages.All.NoItem, CheckType.HasItem)
      .capture()
      .require(
        item.affects.find(affect => affect.affectType === AffectType.Sharpened) === undefined,
        PreconditionMessages.Sharpen.AlreadySharpened)
      .require(
        item instanceof Weapon,
        PreconditionMessages.Sharpen.NotAWeapon)
      .require(
        item.damageType === DamageType.Slash,
        PreconditionMessages.Sharpen.NotABladedWeapon)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    const target = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    const responseBuilder = checkedRequest.respondWith()

    if (SharpenAction.calculateSharpenSaves(skill) < Thresholds.Sharpen) {
      return responseBuilder.fail(
        ActionMessages.Sharpen.Failure,
        { verb: "fail", target },
        { verb: "fail", target },
        { verb: "fails", target })
    }

    target.affects.push(newPermanentAffect(
      AffectType.Sharpened,
      newAttributesWithHitroll(newHitroll(1, roll(1, skill.level / 10) + 1))))

    return responseBuilder.success(
      ActionMessages.Sharpen.Success,
      { verb: "sharpen", target },
      { verb: "sharpen", target },
      { verb: "sharpens", target })
  }

  public getActionType(): ActionType {
    return ActionType.Neutral
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 10)
    } else if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 1)
    } else if (specializationType === SpecializationType.Cleric) {
      return new SpecializationLevel(SpecializationType.Cleric, 40)
    }

    return new SpecializationLevel(SpecializationType.Mage, 30)
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mana, Costs.Sharpen.Mana),
      new Cost(CostType.Mv, Costs.Sharpen.Mv),
      new Cost(CostType.Delay, Costs.Sharpen.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Sharpen
  }

  public getAffectType(): AffectType {
    return AffectType.Sharpened
  }

  protected getRequestType(): RequestType {
    return RequestType.Sharpen
  }
}
