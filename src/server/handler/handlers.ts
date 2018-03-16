import { Equipped } from "../../item/model/equipped"
import { Inventory } from "../../item/model/inventory"
import { Item } from "../../item/model/item"
import { Player } from "../../player/model/player"
import { Direction } from "../../room/constants"
import { findOneExit } from "../../room/repository/exit"
import { findOneRoom } from "../../room/repository/room"
import { Request } from "./../request/request"
import { RequestType } from "./constants"
import { HandlerCollection } from "./handlerCollection"
import { HandlerDefinition } from "./handlerDefinition"
import { gossip } from "./social"

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

  return doWithItemOrElse(
    roomInv.findItem(request.subject),
    (item: Item) => {
      roomInv.removeItem(item)
      request.player.getInventory().addItem(item)

      return { message: "You pick up " + item.name + "." }
    },
    "You can't find that anywhere.")
}

function drop(request: Request): Promise<any> {
  return doWithItemOrElse(
    request.findItemInSessionMobInventory(),
    (item: Item) => {
      request.player.getInventory().removeItem(item)
      request.getRoom().inventory.addItem(item)

      return { message: "You drop " + item.name + "." }
    },
    "You don't have that.")
}

function wear(request: Request): Promise<any> {
  return doWithItemOrElse(
    request.findItemInSessionMobInventory(),
    (item: Item) => {
      const playerInv = request.player.getInventory()
      const playerEquipped = request.player.sessionMob.equipped
      const currentlyEquippedItem = playerEquipped.items.find((eq) => eq.equipment === item.equipment)

      let removal = ""
      if (currentlyEquippedItem) {
        removeEq(playerEquipped, playerInv, currentlyEquippedItem)
        removal = " remove " + currentlyEquippedItem.name + " and"
      }

      playerInv.removeItem(item)
      playerEquipped.items.push(item)

      return { message: "You" + removal + " wear " + item.name + "." }
    },
    "You don't have that.")
}

function remove(request: Request): Promise<any> {
  const playerEquipped = request.player.sessionMob.equipped
  return doWithItemOrElse(
    playerEquipped.items.find((i) => i.matches(request.subject)),
    (item: Item) => {
      removeEq(playerEquipped, request.player.getInventory(), item)
      return { message: "You remove " + item.name + " and put it in your inventory." }
    },
    "You aren't wearing that.")
}

export function doWithItemOrElse(item: Item, ifItem: (item: Item) => {}, ifNotItemMessage: string): Promise<any> {
  return new Promise((resolve) => {
    if (!item) {
      return resolve({message: ifNotItemMessage})
    }

    return resolve(ifItem(item))
  })
}

function removeEq(playerEq: Equipped, receivingInventory: Inventory, item: Item) {
  playerEq.items = playerEq.items.filter((i) => i !== item)
  receivingInventory.addItem(item)
}

function equipped(request: Request): Promise<any> {
  return new Promise((resolve) =>
    resolve({
      message: "You are wearing:\n" + request.player.sessionMob.equipped.items.map((item) => item.name).join("\n"),
    }))
}

function gossipHandler(request: Request): Promise<any> {
  return new Promise((resolve) => {
    gossip(request.player, request.player.sessionMob.name + " gossips, \"" + request.message + "\"")
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
