import Check from "../../check/check"
import {CheckType} from "../../check/checkType"
import GameService from "../../gameService/gameService"
import {Request} from "../../request/request"
import match from "../../support/matcher/match"
import {Messages} from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .require(
      request.getSubject(),
      Messages.All.Arguments.Close,
      CheckType.HasArguments)
    .require(
      request.room.exits.find(exit => exit.door && match(exit.door.name, request.getSubject())),
      Messages.Close.Fail.NotFound,
      CheckType.HasTarget)
    .capture()
    .require(
      exit => !exit.door.isClosed,
      Messages.Close.Fail.AlreadyClosed)
    .require(
      exit => !exit.door.noClose,
      Messages.Close.Fail.CannotClose)
    .create()
}
