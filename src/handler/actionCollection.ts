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
import { Collection } from "./definition/collection"
import { Definition } from "./definition/definition"

export const actions = new Collection([
  // moving
  new Definition(RequestType.North, (request: Request) => move(request.player, Direction.North)),
  new Definition(RequestType.South, (request: Request) => move(request.player, Direction.South)),
  new Definition(RequestType.East, (request: Request) => move(request.player, Direction.East)),
  new Definition(RequestType.West, (request: Request) => move(request.player, Direction.West)),
  new Definition(RequestType.Up, (request: Request) => move(request.player, Direction.Up)),
  new Definition(RequestType.Down, (request: Request) => move(request.player, Direction.Down)),

  // items
  new Definition(RequestType.Inventory, inventory),
  new Definition(RequestType.Get, get),
  new Definition(RequestType.Drop, drop),
  new Definition(RequestType.Wear, wear),
  new Definition(RequestType.Remove, remove),
  new Definition(RequestType.Equipped, equipped),

  // fighting
  new Definition(RequestType.Kill, kill),
  new Definition(RequestType.Bash, (request: Request) => doSkill(request, SkillType.Bash)),
  new Definition(RequestType.Trip, (request: Request) => doSkill(request, SkillType.Trip)),

  // skills
  new Definition(RequestType.Berserk, (request: Request) => doSkill(request, SkillType.Berserk)),
  new Definition(RequestType.Sneak, (request: Request) => doSkill(request, SkillType.Sneak)),

  // casting
  new Definition(RequestType.Cast, cast),

  // info
  new Definition(RequestType.Affects, affects),
  new Definition(RequestType.Look, look),

  // social
  new Definition(RequestType.Gossip, gossip),
])
