import seraph from 'seraph'
import { DB_CONNECTION_STRING } from 'config'

export const db = seraph(DB_CONNECTION_STRING)
