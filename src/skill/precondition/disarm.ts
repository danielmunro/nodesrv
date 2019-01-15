import Check from "../../check/check"
import CheckTemplate from "../../check/checkTemplate"
import { CheckType } from "../../check/checkType"
import GameService from "../../gameService/gameService"
import { Equipment } from "../../item/equipment"
import { Request } from "../../request/request"
import Skill from "../skill"
import { Messages } from "./constants"

export default function(request: Request, skillDefinition: Skill, service: GameService): Promise<Check> {
  const checkTemplate = new CheckTemplate(service.mobService, request)
  const checkBuilder = checkTemplate.perform(skillDefinition)
  const target = checkTemplate.getTarget()
  if (!target) {
    return checkBuilder.create()
  }
  return checkBuilder
    .require(
      target.equipped.find(i => i.equipment === Equipment.Weapon),
      Messages.Disarm.FailNothingToDisarm,
      CheckType.ItemPresent)
    .create()
}
