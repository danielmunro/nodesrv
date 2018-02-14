import * as model from "seraph-model"
import { db } from "./../db"
import { ROOM_DOMAIN } from "./../domain"
import { saveDataSet } from "./../model"
import { allDirections } from "./constants"
import { Room } from "./room"

const RoomModel = model(db, ROOM_DOMAIN)

function directionsForRoom(room) {
  return allDirections.filter((d) => room[d])
}

function createDirectionalRelationshipsBetweenRoomModels(models) {
  const nameMap = {}

  // create a map of name => id (both unique)
  models.map((m) => nameMap[m.name] = m.id)

  // use the name map to relate rooms
  models.map((m) =>
    directionsForRoom(m).map((d) =>
      db.relate(m.id, d, nameMap[m[d]], {}, () => {})))
}

export function saveRooms(rooms: Room[]) {
  saveDataSet(RoomModel, rooms, createDirectionalRelationshipsBetweenRoomModels)
}

export default RoomModel
