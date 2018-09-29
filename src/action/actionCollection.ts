import CheckedRequest from "../check/checkedRequest"
import { Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { Direction } from "../room/constants"
import Service from "../service/service"
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
import put from "./actions/put"
import remove from "./actions/remove"
import sacrifice from "./actions/sacrifice"
import say from "./actions/say"
import score from "./actions/score"
import sell from "./actions/sell"
import train from "./actions/train"
import wear from "./actions/wear"
import { Collection } from "./definition/collection"
import ban from "./moderation/actions/ban"
import demote from "./moderation/actions/demote"
import promote from "./moderation/actions/promote"
import unban from "./moderation/actions/unban"
import { default as banPrecondition } from "./moderation/precondition/ban"
import { default as demotePrecondition } from "./moderation/precondition/demote"
import { default as promotePrecondition } from "./moderation/precondition/promote"
import { default as unbanPrecondition } from "./moderation/precondition/unban"
import { default as buyPrecondition } from "./precondition/buy"
import { default as castPrecondition } from "./precondition/cast"
import { default as dropPrecondition } from "./precondition/drop"
import { default as eatPrecondition } from "./precondition/eat"
import { default as fleePrecondition } from "./precondition/flee"
import { default as getPrecondition } from "./precondition/get"
import { default as killPrecondition } from "./precondition/kill"
import { default as movePrecondition } from "./precondition/move"
import { default as putPrecondition } from "./precondition/put"
import { default as removePrecondition } from "./precondition/remove"
import { default as sacrificePrecondition } from "./precondition/sacrifice"
import { default as sellPrecondition } from "./precondition/sell"
import { default as trainPrecondition } from "./precondition/train"
import { default as wearPrecondition } from "./precondition/wear"

function newMoveDefinition(service: Service, requestType: RequestType, direction: Direction) {
  return service.getNewDefinition(requestType,
    (checkedRequest: CheckedRequest) => move(checkedRequest, direction, service),
    (request: Request) => movePrecondition(request, direction))
}

function newSkillDefinition(service: Service, requestType: RequestType, skillType: SkillType) {
  return service.getNewDefinition(requestType, (request: Request) => doSkill(request, skillType))
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
    service.getNewDefinition(RequestType.Inventory, inventory),
    service.getNewDefinition(RequestType.Get, get, getPrecondition),
    service.getNewDefinition(RequestType.Drop, drop, dropPrecondition),
    service.getNewDefinition(RequestType.Put, put, putPrecondition),
    service.getNewDefinition(RequestType.Wear, wear, wearPrecondition),
    service.getNewDefinition(RequestType.Remove, remove, removePrecondition),
    service.getNewDefinition(RequestType.Equipped, equipped),

    // fighting
    service.getNewDefinition(RequestType.Kill, kill, killPrecondition),
    service.getNewDefinition(RequestType.Flee, flee, fleePrecondition),
    newSkillDefinition(service, RequestType.Bash, SkillType.Bash),
    newSkillDefinition(service, RequestType.Trip, SkillType.Trip),

    // skills
    newSkillDefinition(service, RequestType.Berserk, SkillType.Berserk),
    newSkillDefinition(service, RequestType.Sneak, SkillType.Sneak),

    // casting
    service.getNewDefinition(RequestType.Cast, cast, castPrecondition),

    // info
    service.getNewDefinition(RequestType.Affects, affects),
    service.getNewDefinition(RequestType.Look, look),
    service.getNewDefinition(RequestType.Score, score),

    // merchants
    service.getNewDefinition(RequestType.Buy, buy, buyPrecondition),
    service.getNewDefinition(RequestType.Sell, sell, sellPrecondition),

    // social
    service.getNewDefinition(RequestType.Gossip, gossip),
    service.getNewDefinition(RequestType.Say, say),

    // training
    service.getNewDefinition(RequestType.Train, train, trainPrecondition),

    // nourishment
    service.getNewDefinition(RequestType.Eat, eat, eatPrecondition),

    // sacrifice
    service.getNewDefinition(RequestType.Sacrifice, sacrifice, sacrificePrecondition),
  ], [
    service.getNewDefinition(RequestType.Ban, ban, banPrecondition),
    service.getNewDefinition(RequestType.Unban, unban, unbanPrecondition),
    service.getNewDefinition(RequestType.Promote, promote, promotePrecondition),
    service.getNewDefinition(RequestType.Demote, demote, demotePrecondition),
  ])
}
