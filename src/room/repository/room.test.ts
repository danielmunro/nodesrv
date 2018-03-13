import { getTestRoom } from "../../test/room"
import { findOneRoom, getRoomRepository } from "./room"

describe("room repository", () => {
  it("should be able to use the shorthand helper method to load a room", () => {
    const room = getTestRoom()

    expect.assertions(1)
    return getRoomRepository().then((roomRepository) =>
      roomRepository.save(room).then(() =>
        findOneRoom(room.id).then((loadedEntity) =>
          expect(loadedEntity.id).toBe(room.id))))
  })
})
