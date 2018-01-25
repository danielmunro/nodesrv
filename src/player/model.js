import { db } from 'db'
import model from 'seraph-model'
import { PLAYER_DOMAIN } from 'config'

export default model(db, PLAYER_DOMAIN)
