import seraph from 'seraph'
import model from 'seraph-model'
import { DB_CONNECTION_STRING, DOMAINS } from '../constants'

const db = seraph(DB_CONNECTION_STRING)
const Room = model(db, DOMAINS.room)

Room.save({
  brief: 'Inn at the Lodge',
  description: 'Something cool.'
}, (err, node) => {
  if (err) {
    throw err
  }
})
