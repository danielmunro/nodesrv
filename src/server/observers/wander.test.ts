import TestBuilder from "../../test/testBuilder"
import { Wander } from "./wander"

describe("wander", () => {
  it("should cause a mob to move", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mob = testBuilder.withMob().mob
    testBuilder.withRoom()
    testBuilder.withRoom()
    const locationService = (await testBuilder.getService()).mobService.locationService
    const wander = new Wander([mob], locationService)
    const initialRoom = locationService.getLocationForMob(mob).room.uuid

    // given
    mob.traits.wanders = true

    // when
    await wander.notify([])

    // then
    const location = locationService.getLocationForMob(mob)
    expect(location.room.uuid).not.toBe(initialRoom.uuid)
  })
})
