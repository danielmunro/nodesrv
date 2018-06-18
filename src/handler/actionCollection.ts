import { Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { Direction } from "../room/constants"
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
import { createHandler, doSkill } from "./actionHelpers"
import { HandlerCollection } from "./handlerCollection"

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
  createHandler(RequestType.Bash, (request: Request) => doSkill(request, SkillType.Bash)),
  createHandler(RequestType.Trip, (request: Request) => doSkill(request, SkillType.Trip)),

  // skills
  createHandler(RequestType.Berserk, (request: Request) => doSkill(request, SkillType.Berserk)),
  createHandler(RequestType.Sneak, (request: Request) => doSkill(request, SkillType.Sneak)),

  // casting
  createHandler(RequestType.Cast, cast),

  // info
  createHandler(RequestType.Affects, affects),
  createHandler(RequestType.Look, look),

  // social
  createHandler(RequestType.Gossip, gossip),
])
