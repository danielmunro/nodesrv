import Check from "../../check/check"
import {CheckType} from "../../check/checkType"
import GameService from "../../gameService/gameService"
import {Request} from "../../request/request"
import match from "../../support/matcher/match"
import {Messages} from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  return service.createDefaultCheckFor(request)
    .require(
      request.getSubject(),
      Messages.All.Arguments.Unlock,
      CheckType.HasArguments)
    .require(
      request.room.exits.find(exit => exit.door && match(exit.door.name, request.getSubject())),
      Messages.Unlock.Fail.NotFound,
      CheckType.HasTarget)
    .capture()
    .require(
      exit => exit.door.isLocked,
      Messages.Unlock.Fail.AlreadyUnlocked)
    .require(
      exit =>
        service.itemService.getByCanonicalId(exit.door.unlockedByCanonicalId)
          .find(item => item.inventory === request.mob.inventory),
      Messages.Unlock.Fail.NoKey)
    .create()
}
