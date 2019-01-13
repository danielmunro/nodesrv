import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import {CheckType} from "../../check/checkType"
import GameService from "../../gameService/gameService"
import {ItemType} from "../../item/itemType"
import {Request} from "../../request/request"
import match from "../../support/matcher/match"
import {Messages} from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const checkBuilder = service.createDefaultCheckFor(request)
    .require(
      request.getSubject(),
      Messages.All.Arguments.Open,
      CheckType.HasArguments)

  if (!request.getSubject()) {
    return checkBuilder.create()
  }

  const door = getDoor(request)
  if (door) {
    return requireDoorPreconditions(checkBuilder, door).create()
  }

  const item = getItem(request)
  if (item) {
    return requireItemPreconditions(checkBuilder, item).create()
  }

  return checkBuilder.create()
}

function getItem(request: Request) {
  return request.mob.inventory.findItemByName(request.getSubject())
}

function requireItemPreconditions(checkBuilder: CheckBuilder, item) {
  return checkBuilder.require(
    item,
    Messages.Open.Fail.NotFound,
    CheckType.HasTarget)
    .capture()
    .require(
      item.itemType === ItemType.Container,
      Messages.Open.Fail.NotAContainer)
    .require(
      item.container.isClosed,
      Messages.Open.Fail.AlreadyOpen)
}

function getDoor(request) {
  return request.room.exits.find(exit => exit.door && match(exit.door.name, request.getSubject()))
}

function requireDoorPreconditions(checkBuilder: CheckBuilder, door) {
  return checkBuilder.require(
      door,
      Messages.Open.Fail.NotFound,
      CheckType.HasTarget)
    .capture()
    .require(
      exit => !exit.door.isLocked,
      Messages.Open.Fail.Locked)
    .require(
      exit => exit.door.isClosed,
      Messages.Open.Fail.AlreadyOpen)
}
