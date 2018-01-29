import { find } from "../../db"

export function findNodes(label, name, cb): void {
  find(label, { name }, (err, nodes) => {
    if (err) {
      throw err
    }
    cb(nodes)
  })
}