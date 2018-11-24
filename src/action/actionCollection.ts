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
  return service.getNewActionDefinition(requestType,
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
    service.getNewActionDefinition(RequestType.Inventory, inventory),
    service.getNewActionDefinition(RequestType.Get, get, getPrecondition),
    service.getNewActionDefinition(RequestType.Drop, drop, dropPrecondition),
    service.getNewActionDefinition(RequestType.Put, put, putPrecondition),
    service.getNewActionDefinition(RequestType.Wear, wear, wearPrecondition),
    service.getNewActionDefinition(RequestType.Remove, remove, removePrecondition),
    service.getNewActionDefinition(RequestType.Equipped, equipped),

    // fighting
    service.getNewActionDefinition(RequestType.Kill, kill, killPrecondition),
    service.getNewActionDefinition(RequestType.Flee, flee, fleePrecondition),

    // skills
    service.getNewActionDefinition(RequestType.Bash, bash, bashPrecondition),
    service.getNewActionDefinition(RequestType.Berserk, berserk, berserkPrecondition),
    service.getNewActionDefinition(RequestType.Disarm, disarm, disarmPrecondition),
    service.getNewActionDefinition(RequestType.Envenom, envenom, envenomPrecondition),
    service.getNewActionDefinition(RequestType.Sneak, sneak, sneakPrecondition),
    service.getNewActionDefinition(RequestType.Trip, trip, tripPrecondition),
    service.getNewActionDefinition(RequestType.Steal, steal, stealPrecondition),

    // casting
    service.getNewActionDefinition(RequestType.Cast, cast, castPrecondition),

    // info
    service.getNewActionDefinition(RequestType.Affects, affects),
    service.getNewActionDefinition(RequestType.Look, look, lookPrecondition),
    service.getNewActionDefinition(RequestType.Lore, lore, lorePrecondition),
    service.getNewActionDefinition(RequestType.Score, score),

    // merchants
    service.getNewActionDefinition(RequestType.Buy, buy, buyPrecondition),
    service.getNewActionDefinition(RequestType.Sell, sell, sellPrecondition),

    // social
    service.getNewActionDefinition(RequestType.Gossip, gossip),
    service.getNewActionDefinition(RequestType.Say, say),

    // training
    service.getNewActionDefinition(RequestType.Train, train, trainPrecondition),

    // nourishment
    service.getNewActionDefinition(RequestType.Eat, eat, eatPrecondition),

    // sacrifice
    service.getNewActionDefinition(RequestType.Sacrifice, sacrifice, sacrificePrecondition),
  ], [
    service.getNewActionDefinition(RequestType.Ban, ban, banPrecondition),
    service.getNewActionDefinition(RequestType.Unban, unban, unbanPrecondition),
    service.getNewActionDefinition(RequestType.Promote, promote, promotePrecondition),
    service.getNewActionDefinition(RequestType.Demote, demote, demotePrecondition),
  ])
}
