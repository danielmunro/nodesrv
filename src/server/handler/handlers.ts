import { Player } from "../../player/model/player"
import { Direction } from "../../room/constants"
import { findOneExit } from "../../room/repository/exit"
import { findOneRoom } from "../../room/repository/room"
import { Request } from "./../request/request"
import { RequestType } from "./constants"
import { HandlerCollection } from "./handlerCollection"
import { HandlerDefinition } from "./handlerDefinition"
import { gossip } from "./social"

function allButFirstWord(str: string): string {
  return str.substring(str.indexOf(" ") + 1)
}

function move(player: Player, direction: Direction): Promise<any> {
  const exit = player.getExit(direction)
  if (!exit) {
    return new Promise((resolve) => resolve({ message: "Alas, that direction does not exist." }))
  }
  return findOneExit(exit.id).then((e) =>
    findOneRoom(e.destination.id).then((room) => {
      player.moveTo(room)
      return { room }
    }))
}

export function look(request: Request): Promise<any> {
  return new Promise((resolve) => resolve({ room: request.getRoom() }))
}

function handler(requestType: RequestType, cb) {
  return new HandlerDefinition(requestType, cb)
}

function inventory(request: Request): Promise<any> {
  return new Promise((resolve) => resolve({ inventory: request.player.getInventory()}))
}

function get(request: Request): Promise<any> {
  const roomInv = request.getRoom().inventory
  const item = roomInv.items.find((i) => i.matches(request.subject))

  return new Promise((resolve) => {
    if (!item) {
      return resolve({ message: "You can't find that anywhere." })
    }

    roomInv.items = roomInv.items.filter((i) => i !== item)
    request.player.getInventory().items.push(item)

    return resolve({ message: "You pick up " + item.name + "." })
  })
}

function drop(request: Request): Promise<any> {
  const playerInv = request.player.getInventory()
  const item = playerInv.items.find((i) => i.matches(request.subject))

  return new Promise((resolve) => {
    if (!item) {
      return resolve({ message: "You don't have that." })
    }

    playerInv.items = playerInv.items.filter((i) => i !== item)
    request.getRoom().inventory.items.push(item)

    return resolve({ message: "You drop " + item.name + "." })
  })
}

function wear(request: Request): Promise<any> {
  const playerInv = request.player.getInventory()
  const item = playerInv.items.find((i) => i.matches(request.subject))

  return new Promise((resolve) => {
    if (!item) {
      return resolve({ message: "You don't have that." })
    }

    const playerEquipped = request.player.sessionMob.equipped.items
    const currentlyEquippedItem = playerEquipped.find((eq) => eq.equipment === item.equipment)

    if (currentlyEquippedItem) {
      // remove
    }

    playerInv.items = playerInv.items.filter((i) => i !== item)
    playerEquipped.push(item)

    return resolve({ message: "You wear " + item.name + "." })
  })
}

function remove(request: Request): Promise<any> {
  const playerEquipped = request.player.sessionMob.equipped.items
  const item = playerEquipped.find((i) => i.matches(request.subject))

  return new Promise((resolve) => {
    if (!item) {
      return resolve({ message: "You aren't wearing that." })
    }

    request.player.sessionMob.equipped.items = playerEquipped.filter((i) => i !== item)
    request.player.getInventory().items.push(item)

    return resolve({ message: "You remove " + item.name + " and put it in your inventory." })
  })
}

function equipped(request: Request): Promise<any> {
  return new Promise((resolve) =>
    resolve({
      message: "You are wearing:\n" + request.player.sessionMob.equipped.items.map((item) => item.name).join("\n"),
    }))
}

function gossipHandler(request: Request): Promise<any> {
  gossip(request.player, request.player.sessionMob.name + " gossips, \"" + request.message + "\"")
  return new Promise((resolve) => {
    return resolve({ message: "You gossip, '" + request.message + "'"})
  })
}

export const handlers = new HandlerCollection([
  // interacting with room
  handler(RequestType.Look, look),

  // items
  handler(RequestType.Inventory, inventory),
  handler(RequestType.Get, get),
  handler(RequestType.Drop, drop),
  handler(RequestType.Wear, wear),
  handler(RequestType.Remove, remove),
  handler(RequestType.Equipped, equipped),

  // moving
  handler(RequestType.North, (request: Request) => move(request.player, Direction.North)),
  handler(RequestType.South, (request: Request) => move(request.player, Direction.South)),
  handler(RequestType.East, (request: Request) => move(request.player, Direction.East)),
  handler(RequestType.West, (request: Request) => move(request.player, Direction.West)),
  handler(RequestType.Up, (request: Request) => move(request.player, Direction.Up)),
  handler(RequestType.Down, (request: Request) => move(request.player, Direction.Down)),

  // social
  handler(RequestType.Gossip, gossipHandler),
])
