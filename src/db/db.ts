import * as seraph from "seraph"
import { DB_CONNECTION_STRING, DB_PASSWORD } from "./constants"

export const db = seraph({server: DB_CONNECTION_STRING, pass: DB_PASSWORD})

export function findNode(props): Promise<any> {
  return new Promise((resolve, reject) => db.find(props, (err, nodes) => {
    if (nodes) {
      resolve(nodes[0])
      return
    }
    if (err) {
      reject()
    }
  }))
}

