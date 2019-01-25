import {AffectType} from "../../../affect/affectType"
import {newAffect} from "../../../affect/factory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {Messages as CheckMessages} from "../../../check/constants"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import {Mob} from "../../../mob/model/mob"
import {getSizeModifier} from "../../../mob/race/sizeModifier"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {Messages} from "../../../skill/action/constants"
import {Costs} from "../../../skill/constants"
import {Skill as SkillModel} from "../../../skill/model/skill"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class TripAction extends Skill {
  private static calculateDefenseRoll(mob: Mob): number {
    return roll(1, mob.getCombinedAttributes().stats.dex)
  }

  private static calculateTripRoll(mob: Mob, skill: SkillModel): number {
    return roll(1, mob.getCombinedAttributes().stats.dex) + roll(1, skill.level) +
      getSizeModifier(mob.race, -10, 10)
  }

  private static succeedsTripRoll(mob: Mob, skill: SkillModel, target: Mob) {
    return TripAction.calculateTripRoll(mob, skill) > TripAction.calculateDefenseRoll(target)
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const [ target, skill ] = checkedRequest.results(CheckType.HasTarget, CheckType.HasSkill)

    if (!TripAction.succeedsTripRoll(checkedRequest.mob, skill, target)) {
      return checkedRequest.respondWith().fail(
        Messages.Trip.Failure,
        { verb: "trip", target },
        { verb: "trips", target })
    }

    const amount = skill.level / 10
    target.addAffect(newAffect(AffectType.Stunned, amount))
    target.vitals.hp -= amount

    return checkedRequest.respondWith().success(
      Messages.Trip.Success,
      { verb: "trip", target },
      { verb: "trip", target })
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
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
      new Cost(CostType.Mv, Costs.Trip.Mv, CheckMessages.TooTired),
      new Cost(CostType.Delay, Costs.Trip.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Trip
  }

  public getAffectType(): AffectType {
    return AffectType.Stunned
  }

  protected getRequestType(): RequestType {
    return RequestType.Trip
  }
}
