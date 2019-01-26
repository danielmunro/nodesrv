import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import EventService from "../../../event/eventService"
import {EventType} from "../../../event/eventType"
import MobEvent from "../../../mob/event/mobEvent"
import {Mob} from "../../../mob/model/mob"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {ActionMessages} from "../../../skill/constants"
import {Costs} from "../../../skill/constants"
import {Skill as SkillModel} from "../../../skill/model/skill"
import {ConditionMessages as PreconditionMessages} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class StealAction extends Skill {
  private static calculateStealSaves(mob: Mob, skill: SkillModel) {
    const combined = mob.getCombinedAttributes()

    return roll(4, (combined.stats.dex / 5) + ((skill ? skill.level : 10) / 10) + (mob.level / 5))
  }

  constructor(private readonly eventService: EventService, checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory)
  }

  public check(request: Request): Promise<Check> {
    const target = request.getTarget() as Mob
    const subject = request.getSubject()

    return this.checkBuilderFactory.createCheckTemplate(request)
      .perform(this)
      .not().requireFight(PreconditionMessages.All.Fighting)
      .require(
        target ? target.inventory.findItemByName(subject) : false,
        PreconditionMessages.Steal.ErrorNoItem,
        CheckType.HasItem)
      .create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    const mob = checkedRequest.mob
    const target = checkedRequest.request.getTarget() as Mob
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    const replacements = { item, target }
    let success = true

    if (StealAction.calculateStealSaves(mob, skill) <
      StealAction.calculateStealSaves(target, target.findSkill(SkillType.Steal))) {
      if (roll(1, 3) === 1) {
        await this.startFight(checkedRequest)
        success = false
      }

      return checkedRequest
        .respondWith()
        .fail(
          ActionMessages.Steal.Failure,
          { verb: "fail", ...replacements },
          success ? { verb: "fails", target: "you", ...replacements } : null,
          success ? { verb: "fails", ...replacements } : null)
    }

    mob.inventory.addItem(item)

    if (roll(1, 5) === 1) {
      await this.startFight(checkedRequest)
      success = false
    }

    return checkedRequest
      .respondWith()
      .success(
        ActionMessages.Steal.Success,
        success ? { verb: "steal", ...replacements } : null,
        success ? { verb: "steals", item, target: "you" } : null)
  }

  public getActionType(): ActionType {
    return ActionType.Neutral
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 0)
    } else if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 5)
    } else if (specializationType === SpecializationType.Mage) {
      return new SpecializationLevel(SpecializationType.Mage, 0)
    }

    return new SpecializationLevel(SpecializationType.Cleric, 0)
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mv, Costs.Steal.Mv),
      new Cost(CostType.Delay, Costs.Steal.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Steal
  }

  protected getRequestType(): RequestType {
    return RequestType.Steal
  }

  private async startFight(checkedRequest) {
    await this.eventService.publish(
      new MobEvent(EventType.Attack, checkedRequest.mob, checkedRequest.request.getTarget()))
  }
}
