import * as model from "seraph-model"
import { db } from "./../db"
import { ROOM_DOMAIN } from "./../domain"
import { saveModels as parentSaveAllModels } from "./../model"
import { directionsForRoom } from "./index"

const Room = model(db, ROOM_DOMAIN)
const rooms = {}

export function saveModels(dataSet) {
  parentSaveAllModels(Room, dataSet, (newModels) => {
    newModels.map((m) => rooms[m.name] = m.id)
    newModels.map((m) =>
      directionsForRoom(m).map((d) =>
        db.relate(m.id, d, rooms[m[d]], {}, () => {})))
  })
}

export default Room
