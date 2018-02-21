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

function move(player: Player, direction: Direction, cb) {
  const exit = player.getExit(direction)
  if (!exit) {
    cb({ message: 'Alas, that direction does not exist.' })
    return
  }
  findRoom(exit.roomName)
    .then((room: Room) => {
      player.moveTo(room)
      cb({ room: room.getModel() })
    })
}

function handler(requestType: RequestType, cb) {
  return new HandlerDefinition(requestType, cb)
}

export const handlers = [
  handler(RequestType.Look, (request: Request, cb) =>
    cb({ room: request.player.getRoomModel() })),
  
  handler(RequestType.North, (request: Request, cb) =>
    move(request.player, Direction.North, cb)),
  
  handler(RequestType.South, (request: Request, cb) =>
    move(request.player, Direction.South, cb)),
  
  handler(RequestType.East, (request: Request, cb) =>
    move(request.player, Direction.East, cb)),
  
  handler(RequestType.West, (request: Request, cb) =>
    move(request.player, Direction.West, cb)),
  
  handler(RequestType.Up, (request: Request, cb) =>
    move(request.player, Direction.Up, cb)),

  handler(RequestType.Down, (request: Request, cb) =>
    move(request.player, Direction.Down, cb)),

  handler(RequestType.Social, (request: Request, cb) => {
    const { message } = request.args
    gossip(request.player, message)
    cb({ acknowledged: true })
  }),
]