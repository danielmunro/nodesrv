import { Mob } from "../mob/model/mob"
import { Direction } from "./constants"
import { Room } from "./model/room"
import { findOneExit, getExitRepository } from "./repository/exit"
import { findOneRoom, getRoomRepository } from "./repository/room"

function getRepositories() {
  return Promise.all([
    getExitRepository(),
    getRoomRepository(),
  ])
}

export function persistAll(rooms, exits): Promise<Room[]> {
  return getRepositories()
    .then(([exitRepository, roomRepository]) => Promise.all(
      rooms.map((room) => roomRepository.save(room)))
        .then(() => Promise.all(exits.map((exit) => exitRepository.save(exit))))
          .then(() => rooms))
}

export function moveMob(mob: Mob, direction: Direction): Promise<any> {
  return getRoomRepository()
    .then((roomRepository) => roomRepository.findOneById(mob.room.id)
    .then((room) => {
      const exit = room.exits.find((e) => e.direction === direction)

      if (!exit) {
        throw new Error("cannot move in that direction")
      }

      return findOneExit(exit.id).then((e) =>
        findOneRoom(e.destination.id).then((destination) =>
          destination.addMob(mob)))
    }))
}
