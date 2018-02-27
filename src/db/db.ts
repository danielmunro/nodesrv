import * as seraph from "seraph"
import { DB_CONNECTION_STRING } from "./constants"

export const db = seraph({server: DB_CONNECTION_STRING, pass: "test123"})

export function find(domain, params, cb): any {
  db.find(params, cb)
}

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

export function query(queryStr: string, params): Promise<any> {
  return new Promise((resolve, reject) => db.query(queryStr, params, (err, nodes) => {
    if (nodes) {
      resolve(nodes)
      return
    }
    if (err) {
      reject()
    }
  }))
}
