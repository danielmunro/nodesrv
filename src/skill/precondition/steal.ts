import Check from "../../check/check"
import CheckTemplate from "../../check/checkTemplate"
import {CheckType} from "../../check/checkType"
import GameService from "../../gameService/gameService"
import {Mob} from "../../mob/model/mob"
import {Request} from "../../request/request"
import Skill from "../skill"
import {Messages} from "./constants"

export default async function(
  request: Request, skillDefinition: Skill, service: GameService): Promise<Check> {
  const target = request.getTarget() as Mob
  const subject = request.getSubject()

  return new CheckTemplate(service.mobService, request)
    .perform(skillDefinition)
    .not().requireFight(Messages.All.Fighting)
    .require(
      target ? target.inventory.findItemByName(subject) : false,
      Messages.Steal.ErrorNoItem,
      CheckType.HasItem)
    .create()
}
