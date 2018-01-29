import { findNodes } from "./node"

export const handlers = {
  node: (label, name, cb) => findNodes(label, name, (nodes) => cb(nodes)),
}