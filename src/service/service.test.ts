import { Direction } from "../room/constants"
import { getTestMob } from "../test/mob"
import { getTestRoom } from "../test/room"
import TestBuilder from "../test/testBuilder"
import Service from "./service"
import LocationService from "../mob/locationService"

describe("moveMob", () => {
  it("should not allow movement where an exit does not exist", async () => {
    const source = getTestRoom()
    const service = await Service.new(new LocationService([]))
    const mob = getTestMob()
    source.addMob(mob)
    await service.saveRoom(source)
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
