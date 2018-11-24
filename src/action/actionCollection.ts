import GameService from "../gameService/gameService"
import { RequestType } from "../request/requestType"
import { Direction } from "../room/constants"
import bash from "../skill/action/bash"
import berserk from "../skill/action/berserk"
import disarm from "../skill/action/disarm"
import envenom from "../skill/action/envenom"
import sneak from "../skill/action/sneak"
import steal from "../skill/action/steal"
import trip from "../skill/action/trip"
import { default as bashPrecondition } from "../skill/precondition/bash"
import { default as berserkPrecondition } from "../skill/precondition/berserk"
import { default as disarmPrecondition } from "../skill/precondition/disarm"
import { default as envenomPrecondition } from "../skill/precondition/envenom"
import { default as sneakPrecondition } from "../skill/precondition/sneak"
import { default as stealPrecondition } from "../skill/precondition/steal"
import { default as tripPrecondition } from "../skill/precondition/trip"
import affects from "./action/affects"
import buy from "./action/buy"
import cast from "./action/cast"
import drop from "./action/drop"
import eat from "./action/eat"
import equipped from "./action/equipped"
import flee from "./action/flee"
import get from "./action/get"
import gossip from "./action/gossip"
import inventory from "./action/inventory"
import kill from "./action/kill"
import look from "./action/look"
import lore from "./action/lore"
import move from "./action/move"
import put from "./action/put"
import remove from "./action/remove"
import sacrifice from "./action/sacrifice"
import say from "./action/say"
import score from "./action/score"
import sell from "./action/sell"
import train from "./action/train"
import wear from "./action/wear"
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
import { default as lookPrecondition } from "./precondition/look"
import { default as lorePrecondition } from "./precondition/lore"
import { default as movePrecondition } from "./precondition/move"
import { default as putPrecondition } from "./precondition/put"
import { default as removePrecondition } from "./precondition/remove"
import { default as sacrificePrecondition } from "./precondition/sacrifice"
import { default as sellPrecondition } from "./precondition/sell"
import { default as trainPrecondition } from "./precondition/train"
import { default as wearPrecondition } from "./precondition/wear"

function newMoveDefinition(service: GameService, requestType: RequestType, direction: Direction) {
  return service.createActionDefinition(requestType,
    checkedRequest => move(checkedRequest, direction, service),
    request => movePrecondition(request, direction))
}

export default function getActionCollection(service: GameService) {
  return new Collection([
    // moving
    newMoveDefinition(service, RequestType.North, Direction.North),
    newMoveDefinition(service, RequestType.South, Direction.South),
    newMoveDefinition(service, RequestType.East, Direction.East),
    newMoveDefinition(service, RequestType.West, Direction.West),
    newMoveDefinition(service, RequestType.Up, Direction.Up),
    newMoveDefinition(service, RequestType.Down, Direction.Down),

    // items
    service.createActionDefinition(RequestType.Inventory, inventory),
    service.createActionDefinition(RequestType.Get, get, getPrecondition),
    service.createActionDefinition(RequestType.Drop, drop, dropPrecondition),
    service.createActionDefinition(RequestType.Put, put, putPrecondition),
    service.createActionDefinition(RequestType.Wear, wear, wearPrecondition),
    service.createActionDefinition(RequestType.Remove, remove, removePrecondition),
    service.createActionDefinition(RequestType.Equipped, equipped),

    // fighting
    service.createActionDefinition(RequestType.Kill, kill, killPrecondition),
    service.createActionDefinition(RequestType.Flee, flee, fleePrecondition),

    // skills
    service.createActionDefinition(RequestType.Bash, bash, bashPrecondition),
    service.createActionDefinition(RequestType.Berserk, berserk, berserkPrecondition),
    service.createActionDefinition(RequestType.Disarm, disarm, disarmPrecondition),
    service.createActionDefinition(RequestType.Envenom, envenom, envenomPrecondition),
    service.createActionDefinition(RequestType.Sneak, sneak, sneakPrecondition),
    service.createActionDefinition(RequestType.Trip, trip, tripPrecondition),
    service.createActionDefinition(RequestType.Steal, steal, stealPrecondition),

    // casting
    service.createActionDefinition(RequestType.Cast, cast, castPrecondition),

    // info
    service.createActionDefinition(RequestType.Affects, affects),
    service.createActionDefinition(RequestType.Look, look, lookPrecondition),
    service.createActionDefinition(RequestType.Lore, lore, lorePrecondition),
    service.createActionDefinition(RequestType.Score, score),

    // merchants
    service.createActionDefinition(RequestType.Buy, buy, buyPrecondition),
    service.createActionDefinition(RequestType.Sell, sell, sellPrecondition),

    // social
    service.createActionDefinition(RequestType.Gossip, gossip),
    service.createActionDefinition(RequestType.Say, say),

    // training
    service.createActionDefinition(RequestType.Train, train, trainPrecondition),

    // nourishment
    service.createActionDefinition(RequestType.Eat, eat, eatPrecondition),

    // sacrifice
    service.createActionDefinition(RequestType.Sacrifice, sacrifice, sacrificePrecondition),
  ], [
    service.createActionDefinition(RequestType.Ban, ban, banPrecondition),
    service.createActionDefinition(RequestType.Unban, unban, unbanPrecondition),
    service.createActionDefinition(RequestType.Promote, promote, promotePrecondition),
    service.createActionDefinition(RequestType.Demote, demote, demotePrecondition),
  ])
}
