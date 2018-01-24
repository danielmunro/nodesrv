import { db } from 'db'
import model from 'seraph-model'
import { DOMAINS } from 'config'
import { directionsForRoom } from 'room'

const Room = model(db, DOMAINS.room)

function newRoomSavePromise (model) {
  return new Promise((resolve, reject) =>
    Room.save(model, (err, node) => {
      if (err) {
        reject(err)
      }
      resolve(node)
    }))
}

function saveAllModels (models) {
  return models.map(model => newRoomSavePromise(model))
}

function createRelationships (newModels) {
  const idNameMap = getIdNameMap(newModels)
  newModels.map(m =>
    directionsForRoom(m).map(d =>
      db.relate(m.id, d, idNameMap[m[d]], {}, () => {})))
}

function getIdNameMap (models) {
  let idNameMap = {}
  for (let m of models) {
    idNameMap[m.name] = m.id
  }

  return idNameMap
}

export function save (models) {
  Promise.all(saveAllModels(models)).then(createRelationships)
}
