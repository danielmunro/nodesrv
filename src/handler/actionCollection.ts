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
import { doSkill } from "./actionHelpers"
import { newDefinition } from "./definition/factory"
import { HandlerCollection } from "./handlerCollection"

export const actions = new HandlerCollection([
  // moving
  newDefinition(RequestType.North, (request: Request) => move(request.player, Direction.North)),
  newDefinition(RequestType.South, (request: Request) => move(request.player, Direction.South)),
  newDefinition(RequestType.East, (request: Request) => move(request.player, Direction.East)),
  newDefinition(RequestType.West, (request: Request) => move(request.player, Direction.West)),
  newDefinition(RequestType.Up, (request: Request) => move(request.player, Direction.Up)),
  newDefinition(RequestType.Down, (request: Request) => move(request.player, Direction.Down)),

  // items
  newDefinition(RequestType.Inventory, inventory),
  newDefinition(RequestType.Get, get),
  newDefinition(RequestType.Drop, drop),
  newDefinition(RequestType.Wear, wear),
  newDefinition(RequestType.Remove, remove),
  newDefinition(RequestType.Equipped, equipped),

  // fighting
  newDefinition(RequestType.Kill, kill),
  newDefinition(RequestType.Bash, (request: Request) => doSkill(request, SkillType.Bash)),
  newDefinition(RequestType.Trip, (request: Request) => doSkill(request, SkillType.Trip)),

  // skills
  newDefinition(RequestType.Berserk, (request: Request) => doSkill(request, SkillType.Berserk)),
  newDefinition(RequestType.Sneak, (request: Request) => doSkill(request, SkillType.Sneak)),

  // casting
  newDefinition(RequestType.Cast, cast),

  // info
  newDefinition(RequestType.Affects, affects),
  newDefinition(RequestType.Look, look),

  // social
  newDefinition(RequestType.Gossip, gossip),
])
