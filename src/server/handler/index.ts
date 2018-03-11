import { RequestType } from "./constants"
import { Request } from "./../request/request"
import { gossip } from "./social"
import { HandlerDefinition } from "./handlerDefinition"
import { Domain } from "../../domain"
import { Direction, allDirections } from "../../room/constants"
import { findRoom, findExit } from "../../room/repository"
import { Player } from "../../player/player"
import { Room } from "../../room/model/room"

async function move(player: Player, direction: Direction): Promise<any> {
  const exit = player.getExit(direction)
  if (!exit) {
    return new Promise((resolve) => resolve({ message: 'Alas, that direction does not exist.' }))
  }
  const destination = await exit.destination
  return findExit(exit.id).then((exit) => 
    findRoom(exit.destination.id).then(room => {
      player.moveTo(room)
      return { room }
    }))
}

function handler(requestType: RequestType, cb) {
  return new HandlerDefinition(requestType, cb)
}

export function look(request: Request): Promise<any> {
  return new Promise((resolve) => resolve({ room: request.player.getRoom() }))
}

export const handlers = [
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
    gossip(request.player, request.player.getMob().getName()+ " gossips, \"" + message + "\"")
    return {
      message: "You gossip, '" + message + "'"  
    }
  }),
]