import { Player } from "../../player/model/player"
import { Direction } from "../../room/constants"
import { findOneExit } from "../../room/repository/exit"
import { findOneRoom } from "../../room/repository/room"
import { Request } from "./../request/request"
import { RequestType } from "./constants"
import { HandlerCollection } from "./handlerCollection"
import { HandlerDefinition } from "./handlerDefinition"
import { gossip } from "./social"

async function move(player: Player, direction: Direction): Promise<any> {
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

function handler(requestType: RequestType, cb) {
  return new HandlerDefinition(requestType, cb)
}

export function look(request: Request): Promise<any> {
  return new Promise((resolve) => resolve({ room: request.getRoom() }))
}

export const handlers = new HandlerCollection([
  // interacting with room
  handler(RequestType.Look, (request: Request) => look(request)),

  // moving around
  handler(RequestType.North, (request: Request) => move(request.player, Direction.North)),
  handler(RequestType.South, (request: Request) => move(request.player, Direction.South)),
  handler(RequestType.East, (request: Request) => move(request.player, Direction.East)),
  handler(RequestType.West, (request: Request) => move(request.player, Direction.West)),
  handler(RequestType.Up, (request: Request) => move(request.player, Direction.Up)),
  handler(RequestType.Down, (request: Request) => move(request.player, Direction.Down)),

  // social
  handler(RequestType.Gossip, (request: Request) => {
    const message = request.args.request.split(" ").slice(1).join(" ")
    gossip(request.player, request.player.sessionMob.name + " gossips, \"" + message + "\"")
    return new Promise((resolve) => {
      return resolve({ message: "You gossip, '" + message + "'"})
    })
  }),
])
