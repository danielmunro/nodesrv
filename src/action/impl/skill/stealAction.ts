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
import ResponseMessage from "../../../request/responseMessage"
import {ActionMessages, ConditionMessages as PreconditionMessages, Costs} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class StealAction extends Skill {
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

  public roll(checkedRequest: CheckedRequest): boolean {
    const mob = checkedRequest.mob
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    const combined = mob.getCombinedAttributes()

    return roll(4, (combined.stats.dex / 5) + ((skill ? skill.level : 10) / 10) + (mob.level / 5)) > 50
  }

  public async applySkill(checkedRequest: CheckedRequest): Promise<void> {
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    checkedRequest.mob.inventory.addItem(item)
    if (roll(1, 5) === 1) {
      await this.startFight(checkedRequest)
    }
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return new ResponseMessage(
      checkedRequest.mob,
      ActionMessages.Steal.Failure,
      { verb: "fail" },
      { verb: "fails", target: "you" },
      { verb: "fails" })
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    return new ResponseMessage(
      checkedRequest.mob,
      ActionMessages.Steal.Success,
      { verb: "steal" },
      { verb: "steals", item, target: "you" })
  }

  public getActionType(): ActionType {
    return ActionType.Neutral
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 5)
    }
    return new SpecializationLevel(SpecializationType.Noop, 0)
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
