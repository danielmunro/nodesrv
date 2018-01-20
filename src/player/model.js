import { db } from 'db'
import model from 'seraph-model'
import { DOMAINS } from 'constants'

export const Player = model(db, DOMAINS.player)
