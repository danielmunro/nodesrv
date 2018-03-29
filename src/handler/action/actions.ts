import { Item } from "../../item/model/item"
import { Direction } from "../../room/constants"
import { Request } from "../../server/request/request"
import { RequestType } from "../constants"
import { HandlerCollection } from "../handlerCollection"
import { HandlerDefinition } from "../handlerDefinition"
import bash from "./bash"
import drop from "./drop"
import equipped from "./equipped"
import get from "./get"
import gossip from "./gossip"
import inventory from "./inventory"
import kill from "./kill"
import look from "./look"
import move from "./move"
import remove from "./remove"
import wear from "./wear"

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

export const handlers = new HandlerCollection([
  // skills
  handler(RequestType.Bash, bash),

  // interacting with room
  handler(RequestType.Look, look),

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

  // social
  handler(RequestType.Gossip, gossip),
])
