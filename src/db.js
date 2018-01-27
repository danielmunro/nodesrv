// @flow

import seraph from 'seraph'
import { DB_CONNECTION_STRING } from './config'
import slugify from 'slugify'
import sillyname from 'sillyname'

export const db = seraph(DB_CONNECTION_STRING)

export function find(domain: string, params: any, cb: () => mixed) {
  db.find(params, cb)
}

export function generateName() {
  return slugify(sillyname(), { lower: true })
}
