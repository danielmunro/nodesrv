import { newAttributes, newHitroll, newStartingStats, newVitals } from "../attributes/factory"
import Stats from "../attributes/model/stats"
import { getConnection } from "../db/connection"
import { newMob } from "../mob/factory"
import { Race } from "../mob/race/race"
import { Direction } from "../room/constants"
import { newReciprocalExit, newRoom } from "../room/factory"
import { Room } from "../room/model/room"
import { getExitRepository } from "../room/repository/exit"
import { getRoomRepository } from "../room/repository/room"

export function newInn(): Promise<Room[]> {
  const innRoom = () => newRoom(
    "A cozy room at the Inn",
    "Something about a room in the inn.")

  return Promise.all([
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
            newStartingStats(),
            newHitroll(2, 3)),
        ),
      ]),
      innRoom(),
      innRoom(),
      innRoom(),
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

      return rooms
    }))
}

export function newRandomTrail() {
  // implement
}
