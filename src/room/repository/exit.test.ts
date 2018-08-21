import { Direction } from "../constants"
import { Exit } from "../model/exit"
import { Room } from "../model/room"
import Service from "../service"
import { getExitRepository } from "./exit"

function getRoomFixture(): Room {
  const room = new Room()
  room.name = "room name"
  room.description = "room description"

  return room
}

describe("exit repository", () => {
  it("should be able to load an exit", async () => {
    // given -- two rooms with a connecting exit
    const source = getRoomFixture()
    const destination = getRoomFixture()
    const exit = new Exit()
    exit.direction = Direction.South
    exit.source = source
    exit.destination = destination

    // and -- entities are persisted
    const service = await Service.new()
    await service.saveRoom([source, destination])
    await service.saveExit(exit)

    // when
    const exitRepository = await getExitRepository()
    const loadedEntity = await exitRepository.findOneById(exit.id)

    // then
    expect(loadedEntity.id).toBe(exit.id)
    expect(loadedEntity.source.id).toBe(source.id)
    expect(loadedEntity.destination.id).toBe(destination.id)
  })
})
