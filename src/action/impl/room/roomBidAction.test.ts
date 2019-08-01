import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import {RealEstateListingEntity} from "../../../room/entity/realEstateListingEntity"
import RealEstateService from "../../../room/service/realEstateService"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let realEstateService: RealEstateService
const input = "room bid 10"

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  realEstateService = app.get<RealEstateService>(Types.RealEstateListingService)
})

describe("room bid action", () => {
  it("can bid on a listed room", async () => {
    // setup
    const bidder = (await testRunner.createMob()).get()
    const room = testRunner.getStartRoom().get()
    const owner = (await testRunner.createMob()).get()
    room.isOwnable = true
    room.owner = owner
    bidder.gold = 10

    // given
    const listing = new RealEstateListingEntity()
    listing.agent = owner
    listing.room = room
    listing.offeringPrice = 10
    await realEstateService.createListing(listing)

    // when
    const response = await testRunner.invokeAction(RequestType.RoomBid, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You bid 10 gold on Test room 1.")
  })

  it("can update a bid", async () => {
    // setup
    const bidder = (await testRunner.createMob()).get()
    const room = testRunner.getStartRoom().get()
    const owner = (await testRunner.createMob()).get()
    room.isOwnable = true
    room.owner = owner
    bidder.gold = 20
    const listing = new RealEstateListingEntity()
    listing.agent = owner
    listing.room = room
    listing.offeringPrice = 10
    await realEstateService.createListing(listing)

    // given
    await testRunner.invokeAction(RequestType.RoomBid, input)

    // when
    const response = await testRunner.invokeAction(RequestType.RoomBid, "room bid 12")

    // then
    expect(response.getMessageToRequestCreator()).toBe("You bid 12 gold on Test room 1.")
    expect(bidder.gold).toBe(8)
  })

  it("deducts the bid amount from the bidder", async () => {
    // setup
    const bidder = (await testRunner.createMob()).get()
    const room = testRunner.getStartRoom().get()
    const owner = (await testRunner.createMob()).get()
    room.isOwnable = true
    room.owner = owner
    bidder.gold = 10

    // given
    const listing = new RealEstateListingEntity()
    listing.agent = owner
    listing.room = room
    listing.offeringPrice = 10
    await realEstateService.createListing(listing)

    // when
    const response = await testRunner.invokeAction(RequestType.RoomBid, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You bid 10 gold on Test room 1.")
  })

  it("requires a listing to bid", async () => {
    // given
    const bidder = (await testRunner.createMob()).get()
    const room = testRunner.getStartRoom().get()
    const owner = (await testRunner.createMob()).get()
    room.isOwnable = true
    room.owner = owner
    bidder.gold = 10

    // when
    const response = await testRunner.invokeAction(RequestType.RoomBid, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("This room is not currently being sold.")
  })

  it("requires money to bid", async () => {
    // setup
    const bidder = (await testRunner.createMob()).get()
    const room = testRunner.getStartRoom().get()
    const owner = (await testRunner.createMob()).get()
    room.isOwnable = true
    room.owner = owner
    const listing = new RealEstateListingEntity()
    listing.agent = owner
    listing.room = room
    listing.offeringPrice = 10
    await realEstateService.createListing(listing)

    // given
    bidder.gold = 1

    // when
    const response = await testRunner.invokeAction(RequestType.RoomBid, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You don't have that much gold.")
  })

  it("cannot bid on own property", async () => {
    // setup
    const bidder = (await testRunner.createMob()).get()
    const room = testRunner.getStartRoom().get()
    const owner = (await testRunner.createMob()).get()
    room.isOwnable = true
    const listing = new RealEstateListingEntity()
    listing.agent = owner
    listing.room = room
    listing.offeringPrice = 10
    bidder.gold = 10
    await realEstateService.createListing(listing)

    // given
    room.owner = bidder

    // when
    const response = await testRunner.invokeAction(RequestType.RoomBid, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You already own this room.")
  })
})
