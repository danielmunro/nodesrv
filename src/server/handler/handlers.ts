import { Item } from "../../item/model/item"
import { addFight, Fight } from "../../mob/fight"
import { findOneMob } from "../../mob/repository/mob"
import { Player } from "../../player/model/player"
import { Direction } from "../../room/constants"
import { findOneExit } from "../../room/repository/exit"
import { findOneRoom } from "../../room/repository/room"
import { Request } from "../request/request"
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

function inventory(request: Request): Promise<any> {
  return new Promise((resolve) => resolve({ inventory: request.player.getInventory()}))
}

function get(request: Request): Promise<any> {
  return doWithItemOrElse(
    request.findItemInRoomInventory(),
    (item: Item) => {
      request.player.getInventory().getItemFrom(item, request.getRoom().inventory)

      return { message: "You pick up " + item.name + "." }
    },
    "You can't find that anywhere.")
}

function drop(request: Request): Promise<any> {
  return doWithItemOrElse(
    request.findItemInSessionMobInventory(),
    (item: Item) => {
      request.getRoom().inventory.getItemFrom(item, request.player.getInventory())

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
      const currentlyEquippedItem = playerEquipped.inventory.find((eq) => eq.equipment === item.equipment)

      let removal = ""
      if (currentlyEquippedItem) {
        playerInv.getItemFrom(currentlyEquippedItem, playerEquipped.inventory)
        removal = " remove " + currentlyEquippedItem.name + " and"
      }

      playerEquipped.inventory.getItemFrom(item, playerInv)

      return { message: "You" + removal + " wear " + item.name + "." }
    },
    "You don't have that.")
}

function remove(request: Request): Promise<any> {
  const eq = request.player.sessionMob.equipped.inventory
  return doWithItemOrElse(
    eq.findItemByName(request.subject),
    (item: Item) => {
      request.player.getInventory().getItemFrom(item, eq)
      return { message: "You remove " + item.name + " and put it in your inventory." }
    },
    "You aren't wearing that.")
}

function equipped(request: Request): Promise<any> {
  return new Promise((resolve) =>
    resolve({
      message: "You are wearing:\n" +
        request.player.sessionMob.equipped.inventory.getItems().map((item) => item.name).join("\n"),
    }))
}

function gossipHandler(request: Request): Promise<any> {
  return new Promise((resolve) => {
    gossip(request.player, request.player.sessionMob.name + " gossips, \"" + request.message + "\"")
    return resolve({ message: "You gossip, '" + request.message + "'"})
  })
}

function kill(request: Request): Promise<any> {
  return new Promise((resolve) => {
    const target = request.getRoom().mobs.find((mob) => mob.matches(request.subject))
    if (!target) {
      return resolve({ message: "They aren't here." })
    }
    return findOneMob(target.id).then((mobTarget) => {
      console.log("TEST")
      const fight = new Fight(request.player.sessionMob, mobTarget)
      addFight(fight)
      return resolve({ message: "You scream and attack!" })
    })
  })
}

export const handlers = new HandlerCollection([
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
  handler(RequestType.Gossip, gossipHandler),
])
