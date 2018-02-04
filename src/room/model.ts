import * as model from "seraph-model"
import { db } from "./../db"
import { ROOM_DOMAIN } from "./../domain"
import { directionsForRoom } from "./index"

const Room = model(db, ROOM_DOMAIN)
const rooms = {}

function newRoomSavePromise(theModel) {
  return new Promise((resolve, reject) =>
    Room.save(theModel, (err, node) => {
      if (err) {
        reject(err)
      }
      rooms[node.name] = node.id
      resolve(node)
    }))
}

function saveAllModels(models) {
  return models.map((m) => newRoomSavePromise(m))
}

function createRelationships(newModels) {
  newModels.map((m) =>
    directionsForRoom(m).map((d) =>
      db.relate(m.id, d, rooms[m[d]], {}, () => {})))
}

export function saveModels(models) {
  Promise.all(saveAllModels(models)).then(createRelationships)
}

export default Room
