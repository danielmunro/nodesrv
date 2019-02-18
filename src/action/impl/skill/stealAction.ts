import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {CheckMessages} from "../../../check/constants"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import EventService from "../../../event/eventService"
import {EventType} from "../../../event/eventType"
import MobEvent from "../../../mob/event/mobEvent"
import {Mob} from "../../../mob/model/mob"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll, {percentRoll} from "../../../random/dice"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import ResponseMessage from "../../../request/responseMessage"
import {ActionMessages, ConditionMessages, Costs} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class StealAction extends Skill {
  constructor(checkBuilderFactory: CheckBuilderFactory, eventService: EventService) {
    super(checkBuilderFactory, eventService)
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckTemplate(request)
      .perform(this)
      .not().requireFight(ConditionMessages.All.Fighting)
      .requireMobInRoom(CheckMessages.NoMob)
      .capture()
      .require(
        (target: Mob) => target.inventory.findItemByName(request.getSubject()),
        ConditionMessages.Steal.ErrorNoItem,
        CheckType.HasItem)
      .create()
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)

    return percentRoll() <= skill.level / 3
  }

  public async applySkill(checkedRequest: CheckedRequest): Promise<void> {
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    checkedRequest.mob.inventory.addItem(item)
    if (roll(1, 5) === 1) {
      await this.startFight(checkedRequest)
    }
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const [ item, target ] = checkedRequest.results(CheckType.HasItem, CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      ActionMessages.Steal.Failure,
      { verb: "fail", item, target },
      { verb: "fails", item, target: "you" },
      { verb: "fails", item, target })
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const [ item, target ] = checkedRequest.results(CheckType.HasItem, CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      ActionMessages.Steal.Success,
      { verb: "steal", item, target },
      { verb: "steals", item, target: "you" },
      { verb: "steals", item, target })
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

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.ItemWithRoomMob, ActionPart.Target]
  }

  public getRequestType(): RequestType {
    return RequestType.Steal
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  private async startFight(checkedRequest: CheckedRequest) {
    await this.eventService.publish(
      new MobEvent(EventType.Attack, checkedRequest.mob, checkedRequest.getCheckTypeResult(CheckType.HasTarget)))
  }
}
