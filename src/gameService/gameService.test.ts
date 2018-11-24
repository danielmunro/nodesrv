import { Direction } from "../room/constants"
import TestBuilder from "../test/testBuilder"

describe("moveMob", () => {
  it("should not allow movement where an exit does not exist", async () => {
    const testBuilder = new TestBuilder()
    const mob = testBuilder.withMob().mob
    const service = await testBuilder.getService()
    return expect(service.moveMob(mob, Direction.North)).rejects.toThrowError()
  })

  it("should allow movement where a direction exists", async () => {
    // setup
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()
    const destination = testBuilder.withRoom(Direction.North).room
    const mob = testBuilder.withMob().mob
    const service = await testBuilder.getService()

    // when
    const location = await service.moveMob(mob, Direction.North)

    // then
    expect(location.room.uuid).toBe(destination.uuid)
  })
})
