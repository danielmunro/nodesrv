import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import {CheckType} from "../../check/checkType"
import GameService from "../../gameService/gameService"
import {Request} from "../../request/request"
import {Messages} from "./constants"
import match from "../../support/matcher/match"

export default function(request: Request, service: GameService): Promise<Check> {
  return new CheckBuilder(service.mobService)
    .require(
      request.getSubject(),
      Messages.All.Arguments.Open,
      CheckType.HasArguments)
    .require(
      request.room.exits.find(exit => match(exit.door.name, request.getSubject())),
      Messages.Open.Fail.NotFound,
      CheckType.HasTarget)
    .require(
      exit => exit.door.isClosed,
      Messages.Open.Fail.AlreadyOpen)
    .create()
}
