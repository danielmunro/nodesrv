import * as fs from "fs"
import { getConnection } from "./../src/db/connection"
import { Mob } from "./../src/mob/model/mob"
import { Race } from "./../src/mob/race/race"
import { Direction } from "./../src/room/constants"
import { newReciprocalExit, newRoom } from "./../src/room/factory"
import { getExitRepository } from "./../src/room/repository/exit"
import { getRoomRepository } from "./../src/room/repository/room"

function newMob(name: string, description: string, race: Race): Mob {
  const mob = new Mob()
  mob.name = name
  mob.description = description
  mob.race = race

  return mob
}

fs.unlink("database.db", () => {
  getConnection().then((connection) =>
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
      ].map((exit) => exitRepository.save(exit))
    })))
})
