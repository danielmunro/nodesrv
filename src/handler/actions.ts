import { Item } from "../item/model/item"
import { Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { Direction } from "../room/constants"
import bash from "../skill/actions/bash"
import berserk from "../skill/actions/berserk"
import sneak from "../skill/actions/sneak"
import trip from "../skill/actions/trip"
import Attempt from "../skill/attempt"
import Outcome from "../skill/outcome"
import { SkillType } from "../skill/skillType"
import affects from "./action/affects"
import cast from "./action/cast"
import drop from "./action/drop"
import equipped from "./action/equipped"
import get from "./action/get"
import gossip from "./action/gossip"
import inventory from "./action/inventory"
import kill from "./action/kill"
import look from "./action/look"
import move from "./action/move"
import remove from "./action/remove"
import wear from "./action/wear"
import { HandlerCollection } from "./handlerCollection"
import { HandlerDefinition } from "./handlerDefinition"

export const MOB_NOT_FOUND = "They aren't here."
export const ATTACK_MOB = "You scream and attack!"

export function doWithItemOrElse(item: Item, ifItem: (item: Item) => {}, ifNotItemMessage: string): Promise<any> {
  return new Promise((resolve) => {
    if (!item) {
      return resolve({message: ifNotItemMessage})
    }

    return resolve(ifItem(item))
  })
}

function createHandler(requestType: RequestType, cb) {
  return new HandlerDefinition(requestType, cb)
}

async function doSkill(request: Request, skillType: SkillType, action: (attempt: Attempt) => Promise<Outcome>) {
  const mob = request.player.sessionMob
  const skill = mob.skills.find((s) => s.skillType === skillType)
  return action(new Attempt(mob, request.getTarget(), skill))
}

export const actions = new HandlerCollection([
  // moving
  createHandler(RequestType.North, (request: Request) => move(request.player, Direction.North)),
  createHandler(RequestType.South, (request: Request) => move(request.player, Direction.South)),
  createHandler(RequestType.East, (request: Request) => move(request.player, Direction.East)),
  createHandler(RequestType.West, (request: Request) => move(request.player, Direction.West)),
  createHandler(RequestType.Up, (request: Request) => move(request.player, Direction.Up)),
  createHandler(RequestType.Down, (request: Request) => move(request.player, Direction.Down)),

  // items
  createHandler(RequestType.Inventory, inventory),
  createHandler(RequestType.Get, get),
  createHandler(RequestType.Drop, drop),
  createHandler(RequestType.Wear, wear),
  createHandler(RequestType.Remove, remove),
  createHandler(RequestType.Equipped, equipped),

  // fighting
  createHandler(RequestType.Kill, kill),
  createHandler(RequestType.Bash, (request: Request) => doSkill(request, SkillType.Bash, bash)),
  createHandler(RequestType.Trip, (request: Request) => doSkill(request, SkillType.Trip, trip)),
  createHandler(RequestType.Sneak, (request: Request) => doSkill(request, SkillType.Sneak, sneak)),
  createHandler(RequestType.Berserk, (request: Request) => doSkill(request, SkillType.Berserk, berserk)),

  // casting
  createHandler(RequestType.Cast, cast),

  // info
  createHandler(RequestType.Affects, affects),
  createHandler(RequestType.Look, look),

  // social
  createHandler(RequestType.Gossip, gossip),
])
