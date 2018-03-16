import { Repository } from "typeorm"
import { Direction } from "../constants"
import { Exit } from "../model/exit"
import { Room } from "../model/room"
import { findOneExit, getExitRepository } from "./exit"
import { getRoomRepository } from "./room"

async function saveRoom(room: Room) {
  return await getRoomRepository().then((roomRepository) => roomRepository.save(room))
}

function getRoomFixture(): Room {
  const room = new Room()
  room.name = "room name"
  room.description = "room description"

  return room
}

describe("exit repository", () => {
  it("helper function should work", () => {
    return getExitRepository().then((exitRepository) =>
      expect(exitRepository).toBeInstanceOf(Repository))
  })

  it("should be able to load an exit", () => {
    const source = getRoomFixture()
    const destination = getRoomFixture()
    const exit = new Exit()
    exit.direction = Direction.South
    exit.source = source
    exit.destination = destination

    expect.assertions(3)
    return Promise.all([saveRoom(source), saveRoom(destination)]).then(() =>
      getExitRepository().then((exitRepository) =>
        exitRepository.save(exit).then(() =>
          findOneExit(exit.id).then((loadedEntity) => {
            expect(loadedEntity.id).toBe(exit.id)
            expect(loadedEntity.source.id).toBe(source.id)
            expect(loadedEntity.destination.id).toBe(destination.id)
          }))))
  })
})
