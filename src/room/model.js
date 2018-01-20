import { db } from 'db'
import model from 'seraph-model'
import { DOMAINS } from 'constants'
import { allDirections } from 'room'

const Room = model(db, DOMAINS.room)

function newRoomSavePromise (model) {
  return new Promise((resolve, reject) =>
    Room.save(model, (err, node) => resolve(node)))
}

export function save (models) {
  Promise.all(
    models.map(model =>
      newRoomSavePromise(model)))
  .then(
    newModels => {
      let idNameMap = {}
      for (let m of newModels) {
        idNameMap[m.name] = m.id
      }
      for (let m of newModels) {
        allDirections()
          .filter(d => m[d])
          .map(d => db.relate(idNameMap[m.name], d, idNameMap[m[d]], {}, () => {}))
      }
    })
}
