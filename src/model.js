import { db } from 'db'

export function find (domain, params, callback) {
  db.find(params, callback)
}
