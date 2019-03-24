import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import {CheckMessages} from "../../../../check/constants"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {EventType} from "../../../../event/eventType"
import MobEvent from "../../../../mob/event/mobEvent"
import {Mob} from "../../../../mob/model/mob"
import roll from "../../../../random/dice"
import ResponseMessage from "../../../../request/responseMessage"
import {ActionMessages, ConditionMessages, Costs} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Steal)
    .setActionType(ActionType.Neutral)
    .setActionParts([ ActionPart.Action, ActionPart.ItemWithRoomMob, ActionPart.Target ])
    .setCheckBuilder((request, checkBuilder) =>
      checkBuilder.not().requireFight(ConditionMessages.All.Fighting)
      .requireMobInRoom(CheckMessages.NoMob)
      .capture()
      .require(
        (target: Mob) => target.inventory.findItemByName(request.getSubject()),
        ConditionMessages.Steal.ErrorNoItem,
        CheckType.HasItem)
      .create())
    .setCosts([
      new MvCost(Costs.Steal.Mv),
      new DelayCost(Costs.Steal.Delay),
    ])
    .setApplySkill(async (checkedRequest) => {
      const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
      checkedRequest.mob.inventory.addItem(item)
      if (roll(1, 5) === 1) {
        await abilityService.publishEvent(
          new MobEvent(EventType.Attack, checkedRequest.mob, checkedRequest.getCheckTypeResult(CheckType.HasTarget)))
      }
    })
    .setSuccessMessage(checkedRequest => {
      const [ item, target ] = checkedRequest.results(CheckType.HasItem, CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        ActionMessages.Steal.Success,
        { verb: "steal", item, target },
        { verb: "steals", item, target: "you" },
        { verb: "steals", item, target })
    })
    .setFailMessage(checkedRequest => {
      const [ item, target ] = checkedRequest.results(CheckType.HasItem, CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        ActionMessages.Steal.Failure,
        { verb: "fail", item, target },
        { verb: "fails", item, target: "you" },
        { verb: "fails", item, target })
    })
    .create()
}
