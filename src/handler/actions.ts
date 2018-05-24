import { Item } from "../item/model/item"
import { Direction } from "../room/constants"
import { Request } from "../request/request"
import bash from "../skill/actions/bash"
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
import { RequestType } from "./constants"
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

function handler(requestType: RequestType, cb) {
  return new HandlerDefinition(requestType, cb)
}

export const actions = new HandlerCollection([
  // moving
  handler(RequestType.North, (request: Request) => move(request.player, Direction.North)),
  handler(RequestType.South, (request: Request) => move(request.player, Direction.South)),
  handler(RequestType.East, (request: Request) => move(request.player, Direction.East)),
  handler(RequestType.West, (request: Request) => move(request.player, Direction.West)),
  handler(RequestType.Up, (request: Request) => move(request.player, Direction.Up)),
  handler(RequestType.Down, (request: Request) => move(request.player, Direction.Down)),

  // items
  handler(RequestType.Inventory, inventory),
  handler(RequestType.Get, get),
  handler(RequestType.Drop, drop),
  handler(RequestType.Wear, wear),
  handler(RequestType.Remove, remove),
  handler(RequestType.Equipped, equipped),

  // fighting
  handler(RequestType.Kill, kill),
  handler(RequestType.Bash, bash),

  // casting
  handler(RequestType.Cast, cast),

  // info
  handler(RequestType.Affects, affects),
  handler(RequestType.Look, look),

  // social
  handler(RequestType.Gossip, gossip),
])
