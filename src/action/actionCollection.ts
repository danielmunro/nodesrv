import { Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { Direction } from "../room/constants"
import Service from "../room/service"
import { SkillType } from "../skill/skillType"
import { doSkill } from "./actionHelpers"
import affects from "./actions/affects"
import buy from "./actions/buy"
import cast from "./actions/cast"
import drop from "./actions/drop"
import eat from "./actions/eat"
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
import score from "./actions/score"
import sell from "./actions/sell"
import train from "./actions/train"
import wear from "./actions/wear"
import CheckedRequest from "./checkedRequest"
import { Collection } from "./definition/collection"
import { Definition } from "./definition/definition"
import ban from "./moderation/actions/ban"
import { default as banPrecondition } from "./moderation/precondition/ban"
import { default as buyPrecondition } from "./precondition/buy"
import { default as castPrecondition } from "./precondition/cast"
import { default as dropPrecondition } from "./precondition/drop"
import { default as eatPrecondition } from "./precondition/eat"
import { default as fleePrecondition } from "./precondition/flee"
import { default as getPrecondition } from "./precondition/get"
import { default as killPrecondition } from "./precondition/kill"
import { default as movePrecondition } from "./precondition/move"
import { default as removePrecondition } from "./precondition/remove"
import { default as sellPrecondition } from "./precondition/sell"
import { default as trainPrecondition } from "./precondition/train"
import { default as wearPrecondition } from "./precondition/wear"

function newMoveDefinition(service: Service, requestType: RequestType, direction: Direction) {
  return new Definition(
    service,
    requestType,
    (checkedRequest: CheckedRequest) => move(checkedRequest, direction, service),
    (request: Request) => movePrecondition(request, direction))
}

function newSkillDefinition(service: Service, requestType: RequestType, skillType: SkillType) {
  return new Definition(
    service,
    requestType,
    (request: Request) => doSkill(request, skillType))
}

export default function getActionCollection(service: Service) {
  return new Collection([
    // moving
    newMoveDefinition(service, RequestType.North, Direction.North),
    newMoveDefinition(service, RequestType.South, Direction.South),
    newMoveDefinition(service, RequestType.East, Direction.East),
    newMoveDefinition(service, RequestType.West, Direction.West),
    newMoveDefinition(service, RequestType.Up, Direction.Up),
    newMoveDefinition(service, RequestType.Down, Direction.Down),

    // items
    new Definition(service, RequestType.Inventory, inventory),
    new Definition(service, RequestType.Get, get, getPrecondition),
    new Definition(service, RequestType.Drop, drop, dropPrecondition),
    new Definition(service, RequestType.Wear, wear, wearPrecondition),
    new Definition(service, RequestType.Remove, remove, removePrecondition),
    new Definition(service, RequestType.Equipped, equipped),

    // fighting
    new Definition(service, RequestType.Kill, kill, killPrecondition),
    new Definition(service, RequestType.Flee, flee, fleePrecondition),
    newSkillDefinition(service, RequestType.Bash, SkillType.Bash),
    newSkillDefinition(service, RequestType.Trip, SkillType.Trip),

    // skills
    newSkillDefinition(service, RequestType.Berserk, SkillType.Berserk),
    newSkillDefinition(service, RequestType.Sneak, SkillType.Sneak),

    // casting
    new Definition(service, RequestType.Cast, cast, castPrecondition),

    // info
    new Definition(service, RequestType.Affects, affects),
    new Definition(service, RequestType.Look, look),
    new Definition(service, RequestType.Score, score),

    // merchants
    new Definition(service, RequestType.Buy, buy, buyPrecondition),
    new Definition(service, RequestType.Sell, sell, sellPrecondition),

    // social
    new Definition(service, RequestType.Gossip, gossip),
    new Definition(service, RequestType.Say, say),

    // training
    new Definition(service, RequestType.Train, train, trainPrecondition),

    // nourishment
    new Definition(service, RequestType.Eat, eat, eatPrecondition),
  ], [
    new Definition(service, RequestType.Ban, ban, banPrecondition),
  ])
}
