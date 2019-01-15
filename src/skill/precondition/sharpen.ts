import {AffectType} from "../../affect/affectType"
import Check from "../../check/check"
import CheckTemplate from "../../check/checkTemplate"
import {CheckType} from "../../check/checkType"
import Cost from "../../check/cost/cost"
import {CostType} from "../../check/cost/costType"
import {DamageType} from "../../damage/damageType"
import GameService from "../../gameService/gameService"
import Weapon from "../../item/model/weapon"
import {Request} from "../../request/request"
import collectionSearch from "../../support/matcher/collectionSearch"
import {Costs} from "../constants"
import Skill from "../skill"
import {Messages} from "./constants"

export default async function(
  request: Request, skillDefinition: Skill, service: GameService): Promise<Check> {
  const item = collectionSearch(request.mob.inventory.items, request.getSubject())

  return new CheckTemplate(service.mobService, request)
    .perform(skillDefinition)
    .not().requireFight(Messages.All.Fighting)
    .require(item, Messages.All.NoItem, CheckType.HasItem)
    .capture()
    .require(
      item.affects.find(affect => affect.affectType === AffectType.Sharpened) === undefined,
      Messages.Sharpen.AlreadySharpened)
    .require(
     item instanceof Weapon,
      Messages.Sharpen.NotAWeapon)
    .require(
      item.damageType === DamageType.Slash,
      Messages.Sharpen.NotABladedWeapon)
    .addCost(new Cost(CostType.Mana, Costs.Sharpen.Mana))
    .create()
}
