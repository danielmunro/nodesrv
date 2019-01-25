import {AffectType} from "../../../affect/affectType"
import {newAffect} from "../../../affect/factory"
import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import {Mob} from "../../../mob/model/mob"
import {getSizeModifier} from "../../../mob/race/sizeModifier"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {Thresholds} from "../../../skill/action/constants"
import {Messages} from "../../../skill/constants"
import {Costs} from "../../../skill/constants"
import {Skill as SkillModel} from "../../../skill/model/skill"
import {Messages as PreconditionMessages} from "../../../skill/precondition/constants"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class SneakAction extends Skill {
  private static calculateSneakRoll(mob: Mob, skill: SkillModel): number {
    return roll(1, mob.level) + roll(2, skill.level) - getSizeModifier(mob.race, 10, -10)
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckTemplate(request)
      .perform(this)
      .not().requireFight(PreconditionMessages.All.Fighting)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    const mob = checkedRequest.mob
    const responseBuilder = checkedRequest.respondWith()

    if (SneakAction.calculateSneakRoll(mob, skill) < Thresholds.Sneak) {
      return responseBuilder.fail(Messages.Sneak.Fail)
    }

    mob.addAffect(newAffect(AffectType.Sneak, mob.level))

    return responseBuilder.success(Messages.Sneak.Success)
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 10)
    } else if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 4)
    } else if (specializationType === SpecializationType.Cleric) {
      return new SpecializationLevel(SpecializationType.Cleric, 45)
    }

    return new SpecializationLevel(SpecializationType.Mage, 45)
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mv, Costs.Sneak.Mv),
      new Cost(CostType.Delay, Costs.Sneak.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Sneak
  }

  public getAffectType(): AffectType {
    return AffectType.Sneak
  }

  protected getRequestType(): RequestType {
    return RequestType.Sneak
  }
}
