import { Handler } from "./constants"
import { MessageHandler } from "./messageHandler"
import { findNodes } from "./node"
import { gossip } from "./social"

export const handlers = [
  {  
    handler: Handler.Node,
    callback: (messageHandler: MessageHandler, cb) => {
      const { label, name } = messageHandler.getArgs()
      findNodes(label, name, (nodes) => cb(nodes))
    },
  },
  {
    handler: Handler.Social,
    callback: (messageHandler: MessageHandler, cb) => {
      const { message } = messageHandler.getArgs()
      gossip(messageHandler.getPlayer(), message)

      return {
        acknowledged: true
      }
    }
  }
]