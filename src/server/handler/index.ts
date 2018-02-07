import { Handler } from "./constants"
import { MessageHandler } from "./messageHandler"
import { findNodes } from "./node"
import { gossip } from "./social"
import { HandlerDefinition } from "./handlerDefinition"

export const handlers = [
  new HandlerDefinition(
    Handler.Node,
    (messageHandler: MessageHandler, cb) => {
      const { label, name } = messageHandler.getArgs()
      findNodes(label, name, (nodes) => cb(nodes))
    }
  ),
  new HandlerDefinition(
    Handler.Social,
    (messageHandler: MessageHandler, cb) => {
      const { message } = messageHandler.getArgs()
      gossip(messageHandler.getPlayer(), message)
      cb({ acknowledged: true })
    }
  ),
]