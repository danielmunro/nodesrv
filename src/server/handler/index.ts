import { RequestType } from "./constants"
import { Request } from "./../request/request"
import { findNode } from "./../../db/db"
import { gossip } from "./social"
import { HandlerDefinition } from "./handlerDefinition"
import { Domain } from "../../domain"
import { Direction, allDirections } from "../../room/constants"
import { Room } from "../../room/room"
import { findRoom } from "../../room/repository"
import { Player } from "../../player/player"

function move(player: Player, direction: Direction) {
  const exit = player.getExit(direction)
  if (!exit) {
    return { message: 'Alas, that direction does not exist.' }
  }
  return findRoom(exit.roomName)
    .then((room: Room) => {
      player.moveTo(room)
      return { room: room.getModel() }
    })
}

function handler(requestType: RequestType, cb) {
  return new HandlerDefinition(requestType, cb)
}

function look(request) {
  return { room: request.player.getRoomModel() }
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
    console.log('request args', request.args)
    const message = request.args.request.split(" ").slice(1).join(" ")
    gossip(request.player, request.player.getMob().getName()+ " gossips, \"" + message + "\"")
    return {
      message: "You gossip, '" + message + "'"  
    }
  }),
]