import * as fs from "fs"
import { newAttributes, newHitroll, newVitals } from "./../src/attributes/factory"
import Stats from "./../src/attributes/model/stats"
import { getConnection } from "./../src/db/connection"
import { newMob } from "./../src/mob/factory"
import { Race } from "./../src/mob/race/race"
import { Direction } from "./../src/room/constants"
import { newReciprocalExit, newRoom } from "./../src/room/factory"
import { getExitRepository } from "./../src/room/repository/exit"
import { getRoomRepository } from "./../src/room/repository/room"

const ormConfig = JSON.parse(fs.readFileSync("ormconfig.json").toString())
ormConfig.synchronize = true

fs.unlink("database.db", () => {
  getConnection(ormConfig).then((connection) =>
    Promise.all([
      getExitRepository(),
      getRoomRepository(),
    ]).then(([exitRepository, roomRepository]) => Promise.all([
      newRoom(
        "Inn at the lodge",
        "Flickering torches provide the only light in the large main mess hall. "
        + "The room is filled with the chatter of travellers preparing for the journey ahead.",
      [
        newMob(
          "an old traveller",
          "an old traveller sits at the bar, studying a small pamphlet",
          Race.Human,
          newVitals(100, 100, 100),
          newAttributes(
            newVitals(100, 100, 100),
            new Stats(),
            newHitroll(2, 3)),
        ),
      ]),
      newRoom(
        "A cozy room at the Inn",
        "Something about a room in the inn."),
      newRoom(
        "A cozy room at the Inn",
        "Something about a room in the inn."),
      newRoom(
        "A cozy room at the Inn",
        "Something about a room in the inn."),
      newRoom(
        "At the crossroads",
        "Something about crossroads."),
    ].map((room) => roomRepository.save(room))).then((rooms) => {
      [
        ...newReciprocalExit(Direction.North, rooms[0], rooms[1]),
        ...newReciprocalExit(Direction.West, rooms[0], rooms[2]),
        ...newReciprocalExit(Direction.East, rooms[0], rooms[3]),
        ...newReciprocalExit(Direction.South, rooms[0], rooms[4]),
      ].map((exit) => exitRepository.save(exit))
    })))
})
