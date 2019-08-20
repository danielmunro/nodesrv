import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {RealEstateListingEntity} from "../../../room/entity/realEstateListingEntity"
import {RoomEntity} from "../../../room/entity/roomEntity"
import RealEstateService from "../../../room/service/realEstateService"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let realEstateService: RealEstateService
let bidder: MobEntity
let owner: MobEntity
let room: RoomEntity
const input = "room bid 10"

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  bidder = (await testRunner.createMob()).get()
  room = testRunner.getStartRoom().get()
  owner = (await testRunner.createMob()).get()
  room.isOwnable = true
  room.owner = owner
  bidder.gold = 10
  realEstateService = app.get<RealEstateService>(Types.RealEstateListingService)
})

function createListing() {
  const listing = new RealEstateListingEntity()
  listing.agent = owner
  listing.room = room
  listing.offeringPrice = 10
  return listing
}

describe("room bid action", () => {
  it("can bid on a listed room", async () => {
    // given
    await realEstateService.createListing(createListing())

    // when
    const response = await testRunner.invokeAction(RequestType.RoomBid, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You bid 10 gold on Test room 1.")
  })

  it("can update a bid", async () => {
    // setup
    bidder.gold = 20
    await realEstateService.createListing(createListing())

    // given
    await testRunner.invokeAction(RequestType.RoomBid, input)

    // when
    const response = await testRunner.invokeAction(RequestType.RoomBid, "room bid 12")

    // then
    expect(response.getMessageToRequestCreator()).toBe("You bid 12 gold on Test room 1.")
    expect(bidder.gold).toBe(8)
  })

  it("deducts the bid amount from the bidder", async () => {
    // given
    await realEstateService.createListing(createListing())

    // when
    const response = await testRunner.invokeAction(RequestType.RoomBid, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You bid 10 gold on Test room 1.")
  })

  it("requires a listing to bid", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.RoomBid, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("This room is not currently being sold.")
  })

  it("requires money to bid", async () => {
    // setup
    await realEstateService.createListing(createListing())

    // given
    bidder.gold = 1

    // when
    const response = await testRunner.invokeAction(RequestType.RoomBid, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You don't have that much gold.")
  })

  it("cannot bid on own property", async () => {
    // setup
    await realEstateService.createListing(createListing())

    // given
    room.owner = bidder

    // when
    const response = await testRunner.invokeAction(RequestType.RoomBid, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You already own this room.")
  })
})
