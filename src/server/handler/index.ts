import { RequestType } from "./constants"
import { Request } from "./messageHandler"
import { findNodes } from "./node"
import { gossip } from "./social"
import { HandlerDefinition } from "./handlerDefinition"

export const handlers = [
  new HandlerDefinition(
    RequestType.Node,
    (request: Request, cb) => {
      const { label, name } = request.getArgs()
      findNodes(label, name, (nodes) => cb(nodes))
    }
  ),
  new HandlerDefinition(
    RequestType.Social,
    (request: Request, cb) => {
      const { message } = request.getArgs()
      gossip(request.getPlayer(), message)
      cb({ acknowledged: true })
    }
  ),
]