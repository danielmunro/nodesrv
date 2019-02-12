import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import Cost from "../../../../check/cost/cost"
import {Mob} from "../../../../mob/model/mob"
import SpecializationLevel from "../../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../../mob/specialization/specializationType"
import roll from "../../../../random/dice"
import {RequestType} from "../../../../request/requestType"
import Response from "../../../../request/response"
import {Skill as SkillModel} from "../../../../skill/model/skill"
import {SkillType} from "../../../../skill/skillType"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../../skill"

export default class SecondAttackAction extends Skill {
  private static isSecondAttackInvoked(mob: Mob, skill: SkillModel) {
    return roll(1, skill.level) > mob.level
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const mob = checkedRequest.mob
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    const responseBuilder = checkedRequest.respondWith()

    if (SecondAttackAction.isSecondAttackInvoked(mob, skill)) {
      return responseBuilder.fail()
    }

    return responseBuilder.success()
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 5)
    } else if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 12)
    } else if (specializationType === SpecializationType.Mage) {
      return new SpecializationLevel(SpecializationType.Mage, 30)
    }

    return new SpecializationLevel(SpecializationType.Cleric, 24)
  }

  public getCosts(): Cost[] {
    return []
  }

  public getSkillType(): SkillType {
    return SkillType.SecondAttack
  }

  public getActionParts(): ActionPart[] {
    return []
  }

  public getRequestType(): RequestType {
    return RequestType.Noop
  }
}
