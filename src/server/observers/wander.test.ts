import MobLocation from "../../mob/model/mobLocation"
import TestBuilder from "../../test/testBuilder"
import { Wander } from "./wander"

describe("wander", () => {
  it("should cause a mob to move", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const room1 = testBuilder.withRoom()
    testBuilder.withRoom()
    const mob = testBuilder.withMob().mob
    const locationService = (await testBuilder.getService()).mobService.locationService
    const wander = new Wander([mob], locationService)
    const initialRoom = locationService.getLocationForMob(mob) as MobLocation
    expect(initialRoom.room.uuid).toBe(room1.room.uuid)

    // given
    mob.traits.wanders = true

    // when
    await wander.notify()

    // then
    const location = locationService.getLocationForMob(mob) as MobLocation
    expect(location.room.uuid).not.toBe(room1.room.uuid)
  })
})
