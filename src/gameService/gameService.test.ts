import { Direction } from "../room/constants"
import TestBuilder from "../test/testBuilder"

describe("moveMob", () => {
  it("should not allow movement where an exit does not exist", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mob = testBuilder.withMob().mob
    const service = await testBuilder.getService()

    // expect
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

  it("sanity checks with mob rooms and location", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const room1 = testBuilder.withRoom().room
    const room2 = testBuilder.withRoom().room
    const mob1 = testBuilder.withMob().mob
    const mob2 = testBuilder.withMob().mob
    const service = await testBuilder.getService()

    // expect
    expect(service.getMobsByRoom(room1)).toHaveLength(2)
    expect(service.getMobsByRoom(room2)).toHaveLength(0)

    // and
    expect(service.getMobLocation(mob1).room).toBe(room1)
    expect(service.getMobLocation(mob2).room).toBe(room1)
  })
})
