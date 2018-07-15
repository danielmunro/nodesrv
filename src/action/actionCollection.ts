import { Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { Direction } from "../room/constants"
import { SkillType } from "../skill/skillType"
import { doSkill } from "./actionHelpers"
import affects from "./actions/affects"
import buy from "./actions/buy"
import cast from "./actions/cast"
import drop from "./actions/drop"
import equipped from "./actions/equipped"
import flee from "./actions/flee"
import get from "./actions/get"
import gossip from "./actions/gossip"
import inventory from "./actions/inventory"
import kill from "./actions/kill"
import look from "./actions/look"
import move from "./actions/move"
import remove from "./actions/remove"
import say from "./actions/say"
import sell from "./actions/sell"
import train from "./actions/train"
import wear from "./actions/wear"
import CheckedRequest from "./checkedRequest"
import { Collection } from "./definition/collection"
import { Definition } from "./definition/definition"
import { default as buyPrecondition } from "./precondition/buy"
import { default as castPrecondition } from "./precondition/cast"
import { default as dropPrecondition } from "./precondition/drop"
import { default as fleePrecondition } from "./precondition/flee"
import { default as getPrecondition } from "./precondition/get"
import { default as killPrecondition } from "./precondition/kill"
import { default as movePrecondition } from "./precondition/move"
import { default as removePrecondition } from "./precondition/remove"
import { default as sellPrecondition } from "./precondition/sell"
import { default as trainPrecondition } from "./precondition/train"
import { default as wearPrecondition } from "./precondition/wear"
import score from "./actions/score"

function newMoveDefinition(requestType: RequestType, direction: Direction) {
  return new Definition(requestType,
    (checkedRequest: CheckedRequest) => move(checkedRequest, direction),
    (request: Request) => movePrecondition(request, direction))
}

function newSkillDefinition(requestType: RequestType, skillType: SkillType) {
  return new Definition(
    requestType,
    (request: Request) => doSkill(request, skillType))
}

export const actions = new Collection([
  // moving
  newMoveDefinition(RequestType.North, Direction.North),
  newMoveDefinition(RequestType.South, Direction.South),
  newMoveDefinition(RequestType.East, Direction.East),
  newMoveDefinition(RequestType.West, Direction.West),
  newMoveDefinition(RequestType.Up, Direction.Up),
  newMoveDefinition(RequestType.Down, Direction.Down),

  // items
  new Definition(RequestType.Inventory, inventory),
  new Definition(RequestType.Get, get, getPrecondition),
  new Definition(RequestType.Drop, drop, dropPrecondition),
  new Definition(RequestType.Wear, wear, wearPrecondition),
  new Definition(RequestType.Remove, remove, removePrecondition),
  new Definition(RequestType.Equipped, equipped),

  // fighting
  new Definition(RequestType.Kill, kill, killPrecondition),
  new Definition(RequestType.Flee, flee, fleePrecondition),
  newSkillDefinition(RequestType.Bash, SkillType.Bash),
  newSkillDefinition(RequestType.Trip, SkillType.Trip),

  // skills
  newSkillDefinition(RequestType.Berserk, SkillType.Berserk),
  newSkillDefinition(RequestType.Sneak, SkillType.Sneak),

  // casting
  new Definition(RequestType.Cast, cast, castPrecondition),

  // info
  new Definition(RequestType.Affects, affects),
  new Definition(RequestType.Look, look),
  new Definition(RequestType.Score, score),

  // merchants
  new Definition(RequestType.Buy, buy, buyPrecondition),
  new Definition(RequestType.Sell, sell, sellPrecondition),

  // social
  new Definition(RequestType.Gossip, gossip),
  new Definition(RequestType.Say, say),

  // training
  new Definition(RequestType.Train, train, trainPrecondition),
])
