import { RequestType } from "./constants"
import { Request } from "./../request/request"
import { findNodes } from "./node"
import { gossip } from "./social"
import { HandlerDefinition } from "./handlerDefinition"
import { Domain } from "../../domain";

export const handlers = [
  new HandlerDefinition(
    RequestType.Node,
    (request: Request, cb) => {
      const { label, name } = request.args
      findNodes(label, name, (nodes) => {
        const response = {}
        response[label] = nodes
        cb(response)
      })
    }
  ),
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
    (request: Request, cb) => {
      findNodes(Domain.Room, request.player.getRoomName(), (nodes) => {
        console.log(nodes)
        cb({ room: nodes[0] })
      })
    }
  ),
]