import {getDefaultUnhandledMessage} from "../client/client"
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
import close from "./action/close"
import drop from "./action/drop"
import eat from "./action/eat"
import equipped from "./action/equipped"
import flee from "./action/flee"
import get from "./action/get"
import gossip from "./action/gossip"
import heal from "./action/heal"
import inventory from "./action/inventory"
import kill from "./action/kill"
import list from "./action/list"
import lock from "./action/lock"
import look from "./action/look"
import lore from "./action/lore"
import move from "./action/move"
import open from "./action/open"
import put from "./action/put"
import remove from "./action/remove"
import sacrifice from "./action/sacrifice"
import say from "./action/say"
import score from "./action/score"
import sell from "./action/sell"
import tell from "./action/tell"
import train from "./action/train"
import unlock from "./action/unlock"
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
import { default as closePrecondition } from "./precondition/close"
import { default as dropPrecondition } from "./precondition/drop"
import { default as eatPrecondition } from "./precondition/eat"
import { default as fleePrecondition } from "./precondition/flee"
import { default as getPrecondition } from "./precondition/get"
import { default as healPrecondition } from "./precondition/heal"
import { default as killPrecondition } from "./precondition/kill"
import { default as listPrecondition } from "./precondition/list"
import { default as lockPrecondition } from "./precondition/lock"
import { default as lookPrecondition } from "./precondition/look"
import { default as lorePrecondition } from "./precondition/lore"
import { default as movePrecondition } from "./precondition/move"
import { default as openPrecondition } from "./precondition/open"
import { default as putPrecondition } from "./precondition/put"
import { default as removePrecondition } from "./precondition/remove"
import { default as sacrificePrecondition } from "./precondition/sacrifice"
import { default as sellPrecondition } from "./precondition/sell"
import { default as socialPrecondition } from "./precondition/socialPrecondition"
import { default as tellPrecondition } from "./precondition/tell"
import { default as trainPrecondition } from "./precondition/train"
import { default as unlockPrecondition } from "./precondition/unlock"
import { default as wearPrecondition } from "./precondition/wear"

function newMoveDefinition(service: GameService, requestType: RequestType, direction: Direction) {
  return service.definition().action(requestType,
    checkedRequest => move(checkedRequest, direction, service),
    request => movePrecondition(request, direction))
}

export default function getActionCollection(service: GameService) {
  const definition = service.definition()
  return new Collection([
    // moving
    newMoveDefinition(service, RequestType.North, Direction.North),
    newMoveDefinition(service, RequestType.South, Direction.South),
    newMoveDefinition(service, RequestType.East, Direction.East),
    newMoveDefinition(service, RequestType.West, Direction.West),
    newMoveDefinition(service, RequestType.Up, Direction.Up),
    newMoveDefinition(service, RequestType.Down, Direction.Down),

    // items
    definition.action(RequestType.Inventory, inventory),
    definition.action(RequestType.Get, get, getPrecondition),
    definition.action(RequestType.Drop, drop, dropPrecondition),
    definition.action(RequestType.Put, put, putPrecondition),
    definition.action(RequestType.Wear, wear, wearPrecondition),
    definition.action(RequestType.Remove, remove, removePrecondition),
    definition.action(RequestType.Equipped, equipped),

    // manipulating environment
    definition.action(RequestType.Close, close, closePrecondition),
    definition.action(RequestType.Open, open, openPrecondition),
    definition.action(RequestType.Unlock, unlock, unlockPrecondition),
    definition.action(RequestType.Lock, lock, lockPrecondition),

    // fighting
    definition.action(RequestType.Kill, kill, killPrecondition),
    definition.action(RequestType.Flee, flee, fleePrecondition),

    // skills
    definition.action(RequestType.Bash, bash, bashPrecondition),
    definition.action(RequestType.Berserk, berserk, berserkPrecondition),
    definition.action(RequestType.Disarm, disarm, disarmPrecondition),
    definition.action(RequestType.Envenom, envenom, envenomPrecondition),
    definition.action(RequestType.Sneak, sneak, sneakPrecondition),
    definition.action(RequestType.Trip, trip, tripPrecondition),
    definition.action(RequestType.Steal, steal, stealPrecondition),

    // casting
    definition.action(RequestType.Cast, cast, castPrecondition),

    // info
    definition.action(RequestType.Affects, affects),
    definition.action(RequestType.Look, look, lookPrecondition),
    definition.action(RequestType.Lore, lore, lorePrecondition),
    definition.action(RequestType.Score, score),

    // merchants/healers
    definition.action(RequestType.Buy, buy, buyPrecondition),
    definition.action(RequestType.Sell, sell, sellPrecondition),
    definition.action(RequestType.List, list, listPrecondition),
    definition.action(RequestType.Heal, heal, healPrecondition),

    // social
    definition.action(RequestType.Gossip, gossip, socialPrecondition),
    definition.action(RequestType.Say, say, socialPrecondition),
    definition.action(RequestType.Tell, tell, tellPrecondition),

    // training
    definition.action(RequestType.Train, train, trainPrecondition),

    // hunger
    definition.action(RequestType.Eat, eat, eatPrecondition),

    // sacrifice
    definition.action(RequestType.Sacrifice, sacrifice, sacrificePrecondition),
  ], [
    definition.action(RequestType.Ban, ban, banPrecondition),
    definition.action(RequestType.Unban, unban, unbanPrecondition),
    definition.action(RequestType.Promote, promote, promotePrecondition),
    definition.action(RequestType.Demote, demote, demotePrecondition),
  ],
  definition.action(RequestType.Any,
      request => Promise.resolve(getDefaultUnhandledMessage(request))))
}
