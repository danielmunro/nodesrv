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
import { default as getPrecondition } from "./precondition/get"
import { default as killPrecondition } from "./precondition/kill"
import { default as movePrecondition } from "./precondition/move"
import { default as removePrecondition } from "./precondition/remove"
import { default as sellPrecondition } from "./precondition/sell"
import { default as trainPrecondition } from "./precondition/train"
import { default as wearPrecondition } from "./precondition/wear"

export const actions = new Collection([
  // moving
  new Definition(RequestType.North,
    (checkedRequest: CheckedRequest) => move(checkedRequest, Direction.North),
    (request: Request) => movePrecondition(request, Direction.North)),
  new Definition(RequestType.South,
    (checkedRequest: CheckedRequest) => move(checkedRequest, Direction.South),
    (request: Request) => movePrecondition(request, Direction.South)),
  new Definition(RequestType.East,
    (checkedRequest: CheckedRequest) => move(checkedRequest, Direction.East),
    (request: Request) => movePrecondition(request, Direction.East)),
  new Definition(RequestType.West,
    (checkedRequest: CheckedRequest) => move(checkedRequest, Direction.West),
    (request: Request) => movePrecondition(request, Direction.West)),
  new Definition(RequestType.Up,
    (checkedRequest: CheckedRequest) => move(checkedRequest, Direction.Up),
    (request: Request) => movePrecondition(request, Direction.Up)),
  new Definition(RequestType.Down,
    (checkedRequest: CheckedRequest) => move(checkedRequest, Direction.Down),
    (request: Request) => movePrecondition(request, Direction.Down)),

  // items
  new Definition(RequestType.Inventory, inventory),
  new Definition(RequestType.Get, get, getPrecondition),
  new Definition(RequestType.Drop, drop, dropPrecondition),
  new Definition(RequestType.Wear, wear, wearPrecondition),
  new Definition(RequestType.Remove, remove, removePrecondition),
  new Definition(RequestType.Equipped, equipped),

  // fighting
  new Definition(RequestType.Kill, kill, killPrecondition),
  new Definition(RequestType.Bash, (request: Request) => doSkill(request, SkillType.Bash)),
  new Definition(RequestType.Trip, (request: Request) => doSkill(request, SkillType.Trip)),

  // skills
  new Definition(RequestType.Berserk, (request: Request) => doSkill(request, SkillType.Berserk)),
  new Definition(RequestType.Sneak, (request: Request) => doSkill(request, SkillType.Sneak)),

  // casting
  new Definition(RequestType.Cast, cast, castPrecondition),

  // info
  new Definition(RequestType.Affects, affects),
  new Definition(RequestType.Look, look),

  // merchants
  new Definition(RequestType.Buy, buy, buyPrecondition),
  new Definition(RequestType.Sell, sell, sellPrecondition),

  // social
  new Definition(RequestType.Gossip, gossip),
  new Definition(RequestType.Say, say),

  // training
  new Definition(RequestType.Train, train, trainPrecondition),
])
