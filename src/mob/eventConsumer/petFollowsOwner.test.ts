import {Direction} from "../../room/constants"
import TestBuilder from "../../test/testBuilder"

describe("pet follows owner event consumer", () => {
  it("a pet should follow its owner", async () => {
    // setup
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()
    const room2 = testBuilder.withRoom(Direction.North).room
    const mob1 = testBuilder.withMob().mob

    // given
    const mob2 = testBuilder.withMob().mob
    mob2.traits.isPet = true
    mob1.pet = mob2

    // when
    const gameService = await testBuilder.getService()
    await gameService.mobService.locationService.updateMobLocation(mob1, room2, Direction.North)

    // then
    const mob2Location = gameService.getMobLocation(mob2)
    expect(mob2Location.room).toBe(room2)
  })
})
