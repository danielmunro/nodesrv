import {Direction} from "../../room/constants"
import TestBuilder from "../../test/testBuilder"
import MobMoveEvent from "../event/mobMoveEvent"

describe("pet follows owner event consumer", () => {
  it("a pet should follow its owner", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const room1 = testBuilder.withRoom().room
    const room2 = testBuilder.withRoom(Direction.North).room
    const mob1 = testBuilder.withMob().mob

    // given
    const mob2 = testBuilder.withMob().mob
    mob2.traits.isPet = true
    mob1.pet = mob2

    // when
    const gameService = await testBuilder.getService()
    gameService.mobService.locationService.updateMobLocation(mob1, room2)
    await gameService.publishEvent(new MobMoveEvent(mob1, room1, room2))

    // then
    const mob2Location = gameService.getMobLocation(mob2)
    expect(mob2Location.room).toBe(room2)
  })
})
