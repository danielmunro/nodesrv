import {createTestAppContainer} from "../../app/testFactory"
import {Direction} from "../../room/constants"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import LocationService from "../locationService"

describe("pet follows owner event consumer", () => {
  it("a pet should follow its owner", async () => {
    // setup
    const app = await createTestAppContainer()
    const testRunner = app.get<TestRunner>(Types.TestRunner)
    const room2 = testRunner.createRoom(Direction.North).get()
    const mob1 = testRunner.createMob().get()

    // given
    const mob2 = testRunner.createMob().get()
    mob2.traits.isPet = true
    mob1.pet = mob2

    // when
    const locationService = app.get<LocationService>(Types.LocationService)
    await locationService.updateMobLocation(mob1, room2, Direction.North)

    // then
    expect(locationService.getRoomForMob(mob2)).toBe(room2)
  })
})
