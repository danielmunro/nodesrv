import * as seraph from 'seraph'
import { DB_CONNECTION_STRING } from './config'
import * as slugify from 'slugify'
import * as sillyname from 'sillyname'

export const db = seraph(DB_CONNECTION_STRING)

export function find(domain, params, cb) {
  db.find(params, cb)
}

export function generateName() {
  return slugify(sillyname(), { lower: true })
}
