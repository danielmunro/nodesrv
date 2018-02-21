import * as seraph from "seraph"
import * as sillyname from "sillyname"
import * as slugify from "slugify"
import { DB_CONNECTION_STRING } from "./constants"

export const db = seraph(DB_CONNECTION_STRING)

export function find(domain, params, cb): any {
  db.find(params, cb)
}

export function findNode(name: string): Promise<any> {
  return new Promise((resolve, reject) => db.find({ name }, (err, nodes) => {
    if (nodes) {
      resolve(nodes[0])
      return
    }
    if (err) {
      reject()
    }
  }))
}

export function generateName(): string {
  return slugify(sillyname(), { lower: true })
}
