import { db } from 'db'
import model from 'seraph-model'
import { DOMAINS } from 'config'

export const Player = model(db, DOMAINS.player)
