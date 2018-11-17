import { Direction } from "../room/constants"
import { getTestMob } from "../test/mob"
import { getTestRoom } from "../test/room"
import TestBuilder from "../test/testBuilder"
import Service from "./service"

describe("moveMob", () => {
  it("should not allow movement where an exit does not exist", async () => {
    const source = getTestRoom()
    const service = await Service.new()
    const mob = getTestMob()
    source.addMob(mob)
    await service.saveRoom(source)
    return expect(service.moveMob(mob, Direction.North)).rejects.toThrowError()
  })

  it("should allow movement where a direction exists", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mob = testBuilder.withMob().mob
    const room = testBuilder.withRoom().room
    const destination = testBuilder.withRoom(Direction.North).room
    const service = await testBuilder.getService()

    // when
    const location = await service.moveMob(mob, Direction.North)

    // then
    console.log(room.uuid, destination.uuid)
    expect(location.room.uuid).toBe(destination.uuid)
  })
})
