import seraph from 'seraph'
import { DB_CONNECTION_STRING } from 'constants'

export const db = seraph(DB_CONNECTION_STRING)
