import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import {RealEstateListingEntity} from "../../../room/entity/realEstateListingEntity"
import RealEstateService from "../../../room/service/realEstateService"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let realEstateService: RealEstateService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  realEstateService = app.get<RealEstateService>(Types.RealEstateListingService)
})

describe("room accept action", () => {
  it("accepts a bid and resolves the transaction", async () => {
    // setup
    const bidder = (await testRunner.createMob()).get()
    const room = testRunner.getStartRoom().get()
    const owner = (await testRunner.createMob()).get()
    room.isOwnable = true
    room.owner = owner
    bidder.gold = 10
    const listing = new RealEstateListingEntity()
    listing.agent = owner
    listing.room = room
    listing.offeringPrice = 10
    await realEstateService.createListing(listing)

    // given
    await testRunner.invokeAction(RequestType.RoomBid, "room bid 10")

    // when
    const response = await testRunner.invokeActionAs(owner, RequestType.RoomAccept, `room accept '${bidder.name}'`)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`You accept the bid from ${bidder.name} on Test room 1. You receive 10 gold.`)
  })
})
