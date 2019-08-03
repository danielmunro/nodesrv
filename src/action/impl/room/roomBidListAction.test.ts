import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import {RealEstateBidEntity} from "../../../room/entity/realEstateBidEntity"
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

describe("room bid list action", () => {
  it("can list multiple bids", async () => {
    const owner = (await testRunner.createMob()).get()
    const bidder1 = (await testRunner.createMob()).get()
    const bidder2 = (await testRunner.createMob()).get()
    const bidder3 = (await testRunner.createMob()).get()
    const room = testRunner.getStartRoom().get()
    room.isOwnable = true
    room.owner = owner
    const listing = new RealEstateListingEntity()
    listing.offeringPrice = 1
    listing.agent = owner
    listing.room = room
    await realEstateService.createListing(listing)
    const bid1 = new RealEstateBidEntity()
    bid1.amount = 1
    bid1.bidder = bidder1
    bid1.listing = listing
    await realEstateService.createBid(bid1)
    const bid2 = new RealEstateBidEntity()
    bid2.amount = 2
    bid2.bidder = bidder2
    bid2.listing = listing
    await realEstateService.createBid(bid2)
    const bid3 = new RealEstateBidEntity()
    bid3.amount = 3
    bid3.bidder = bidder3
    bid3.listing = listing
    await realEstateService.createBid(bid3)

    const response = await testRunner.invokeAction(RequestType.RoomBidList)

    expect(response.getMessageToRequestCreator()).toBe(`Bids on ${room.name}:
${bidder1.name}: 1 gold
${bidder2.name}: 2 gold
${bidder3.name}: 3 gold`)
  })
})
