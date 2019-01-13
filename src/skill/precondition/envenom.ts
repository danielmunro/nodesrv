import Check from "../../check/check"
import CheckTemplate from "../../check/checkTemplate"
import { CheckType } from "../../check/checkType"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import SkillDefinition from "../skillDefinition"
import { Messages } from "./constants"

export default function(request: Request, skillDefinition: SkillDefinition, service: GameService): Promise<Check> {
  return new CheckTemplate(service.mobService, request)
    .perform(skillDefinition)
    .require(
      request.findItemInSessionMobInventory(),
      Messages.All.NoItem,
      CheckType.HasItem)
    .create()
}
