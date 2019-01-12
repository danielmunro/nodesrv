import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import {CheckType} from "../../check/checkType"
import GameService from "../../gameService/gameService"
import {ItemType} from "../../item/itemType"
import {Request} from "../../request/request"
import match from "../../support/matcher/match"
import {Messages} from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const checkBuilder = service.createCheckFor(request.mob)
    .require(
      request.getSubject(),
      Messages.All.Arguments.Close,
      CheckType.HasArguments)

  if (!request.getSubject()) {
    return checkBuilder.create()
  }

  const door = getDoor(request)
  if (door) {
    return requireDoorPreconditions(checkBuilder, request).create()
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
    Messages.Close.Fail.NotFound,
    CheckType.HasTarget)
    .capture()
    .require(
      item.itemType === ItemType.Container,
      Messages.Close.Fail.ItemIsNotAContainer)
    .require(
      !item.container.isClosed,
      Messages.Close.Fail.AlreadyClosed)
    .require(
      item.container.isCloseable,
      Messages.Close.Fail.CannotClose)
}

function getDoor(request) {
  return request.room.exits.find(exit => exit.door && match(exit.door.name, request.getSubject()))
}

function requireDoorPreconditions(checkBuilder: CheckBuilder, request: Request) {
  return checkBuilder.require(
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
}
