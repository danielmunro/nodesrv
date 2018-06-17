import { Item } from "../item/model/item"
import { Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { Direction } from "../room/constants"
import Attempt from "../skill/attempt"
import { CheckResult } from "../skill/checkResult"
import Outcome from "../skill/outcome"
import { OutcomeType } from "../skill/outcomeType"
import { skillCollection } from "../skill/skillCollection"
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
export const PRECONDITION_FAILED = "You don't have enough energy."

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

async function doSkill(request: Request, skillType: SkillType): Promise<Outcome> {
  const mob = request.player.sessionMob
  const skillModel = mob.skills.find((s) => s.skillType === skillType)
  const skillDefinition = skillCollection.find((skillDef) => skillDef.isSkillTypeMatch(skillType))
  const attempt = new Attempt(mob, request.getTarget(), skillModel)
  if (skillDefinition.preconditions) {
    const check = await skillDefinition.preconditions(attempt)
    if (check.checkResult === CheckResult.Unable) {
      return failPrecondition(attempt)
    }
    check.cost(request.player)
  }
  return skillDefinition.action(attempt)
}

function failPrecondition(attempt): Outcome {
  return new Outcome(attempt, OutcomeType.CheckFail, PRECONDITION_FAILED)
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
