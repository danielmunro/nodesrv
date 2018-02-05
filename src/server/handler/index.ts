import { Handler } from "./constants"
import { findNodes } from "./node"

export const handlers = [
  {  
    handler: Handler.Node,
    callback: (label, name, cb) => findNodes(label, name, (nodes) => cb(nodes)),
  }
]