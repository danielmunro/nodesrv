import {AffectType} from "../../../../affect/affectType"
import {Affect} from "../../../../affect/model/affect"
import AttributeBuilder from "../../../../attributes/attributeBuilder"
import {newHitroll} from "../../../../attributes/factory"
import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import MvCost from "../../../../check/cost/mvCost"
import {DamageType} from "../../../../damage/damageType"
import Weapon from "../../../../item/model/weapon"
import ResponseMessage from "../../../../request/responseMessage"
import {
  ActionMessages,
  ConditionMessages as PreconditionMessages,
  Costs,
} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import collectionSearch from "../../../../support/matcher/collectionSearch"
import roll from "../../../../support/random/dice"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Sharpen)
    .setActionType(ActionType.Neutral)
    .setAffectType(AffectType.Sharpened)
    .setActionParts([ ActionPart.Action, ActionPart.ItemInInventory ])
    .setCheckBuilder((request, checkBuilder) => {
      const item = collectionSearch(request.mob.inventory.items, request.getSubject())
      return checkBuilder.not().requireFight(PreconditionMessages.All.Fighting)
        .require(item, PreconditionMessages.All.NoItem, CheckType.HasItem)
        .capture()
        .require(
          item.affects.find((affect: Affect) => affect.affectType === AffectType.Sharpened) === undefined,
          PreconditionMessages.Sharpen.AlreadySharpened)
        .require(
          item instanceof Weapon,
          PreconditionMessages.Sharpen.NotAWeapon)
        .require(
          item.damageType === DamageType.Slash,
          PreconditionMessages.Sharpen.NotABladedWeapon)
        .create()
    })
    .setCosts([
      new ManaCost(Costs.Sharpen.Mana),
      new MvCost(Costs.Sharpen.Mv),
      new DelayCost(Costs.Sharpen.Delay),
    ])
    .setApplySkill(async (checkedRequest, affectBuilder) => {
      const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
      const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
      const affect = affectBuilder
        .setAttributes(new AttributeBuilder()
          .setHitRoll(newHitroll(1, roll(1, skill.level / 10) + 1))
          .build())
        .build()
      item.affects.push(affect)
    })
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        ActionMessages.Sharpen.Success,
        { verb: "sharpen", target },
        { verb: "sharpen", target },
        { verb: "sharpens", target })
    })
    .setFailMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        ActionMessages.Sharpen.Failure,
        { verb: "fail", target },
        { verb: "fail", target },
        { verb: "fails", target })
    })
    .create()
}
