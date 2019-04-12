import TestBuilder from "../../support/test/testBuilder"
import Scavenge from "./scavenge"

const mockService = jest.fn(() => ({sendMessageInRoom: jest.fn()}))

describe("scavenge", () => {
  it("scavengers should scavenge items on the ground", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const room = testBuilder.withRoom().room
    const mob = testBuilder.withMob().mob
    mob.traits.scavenger = true
    testBuilder.withItem()
      .asHelmet()
      .addToInventory(room.inventory)
      .build()
    const mobService = await testBuilder.getMobService()
    const scavenge = new Scavenge(
      mockService(), testBuilder.itemService, mobService.locationService)

    // when
    scavenge.scavenge(mob)

    // then
    expect(testBuilder.itemService.findAllByInventory(mob.inventory)).toHaveLength(1)
    expect(testBuilder.itemService.findAllByInventory(room.inventory)).toHaveLength(0)
  })
})
