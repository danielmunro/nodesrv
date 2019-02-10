import TestBuilder from "../../test/testBuilder"
import Scavenge from "./scavenge"

const mockService = jest.fn(() => ({sendMessageInRoom: jest.fn()}))

describe("scavenge", () => {
  it("scavengers should scavenge items on the ground", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const roomBuilder = testBuilder.withRoom()
    const mob = testBuilder.withMob().mob
    mob.traits.scavenger = true
    roomBuilder.withHelmetEq()
    const service = await testBuilder.getService()
    const scavenge = new Scavenge(
      mockService(), service.itemService, service.mobService.locationService)

    // when
    await scavenge.scavenge(mob)

    // then
    expect(service.itemService.findAllByInventory(mob.inventory)).toHaveLength(1)
    expect(service.itemService.findAllByInventory(roomBuilder.room.inventory)).toHaveLength(0)
  })
})
