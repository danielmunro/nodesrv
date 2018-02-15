import { RequestType } from "./constants"
import { Request } from "./../request/request"
import { findNodes } from "./node"
import { gossip } from "./social"
import { HandlerDefinition } from "./handlerDefinition"

export const handlers = [
  new HandlerDefinition(
    RequestType.Node,
    (request: Request, cb) => {
      const { label, name } = request.args
      findNodes(label, name, (nodes) => cb(nodes))
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
]