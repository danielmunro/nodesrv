import * as model from "seraph-model"
import { db } from "./../db/db"
import { saveDataSet } from "./../db/model"
import { Domain } from "./../domain"
import { allDirections } from "./constants"
import { Room } from "./room"

const RoomModel = model(db, Domain.Room)

function directionsForRoom(room) {
  return allDirections.filter((d) => room[d])
}

function createDirectionalRelationshipsBetweenRoomModels(models) {
  const idMap = {}

  models.map((m) => idMap[m.identifier] = m.id)

  // use the name map to relate rooms
  models.map((m) =>
    directionsForRoom(m).map((direction) =>
      db.relate(m.id, "direction", idMap[m[direction]], { direction }, () => {})))
}

export function saveRooms(rooms: Room[]) {
  saveDataSet(RoomModel, rooms)
    .then(createDirectionalRelationshipsBetweenRoomModels)
}

export default RoomModel
