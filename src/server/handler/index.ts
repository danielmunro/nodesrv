import { RequestType } from "./constants"
import { Request } from "./../request/request"
import { findNode } from "./../../db/db"
import { gossip } from "./social"
import { HandlerDefinition } from "./handlerDefinition"
import { Domain } from "../../domain"
import { Direction } from "../../room/constants"
import { Room } from "../../room/room"
import { findRoom } from "../../room/repository"
import { Player } from "../../player/player";

function move(player: Player, direction: Direction, cb) {
  findRoom(player.getExit(direction).roomName)
    .then((room: Room) => {
      player.moveTo(room)
      cb({ room: room.getModel() })
    })
}

export const handlers = [
  new HandlerDefinition(
    RequestType.Social,
    (request: Request, cb) => {
      const { message } = request.args
      gossip(request.player, message)
      cb({ acknowledged: true })
    }
  ),
  new HandlerDefinition(
    RequestType.Look,
    (request: Request, cb) => findNode(request.player.getRoomName()).then((room) => cb({ room }))
  ),
  new HandlerDefinition(
    RequestType.North,
    (request: Request, cb) => move(request.player, Direction.North, cb)
  ),
  new HandlerDefinition(
    RequestType.South,
    (request: Request, cb) => move(request.player, Direction.South, cb)
  ),
]