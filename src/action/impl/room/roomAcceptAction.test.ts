import {createTestAppContainer} from "../../../app/factory/testFactory"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {RequestType} from "../../../request/enum/requestType"
import {RealEstateBidEntity} from "../../../room/entity/realEstateBidEntity"
import {RealEstateListingEntity} from "../../../room/entity/realEstateListingEntity"
import {RealEstateBidStatus} from "../../../room/enum/realEstateBidStatus"
import RealEstateService from "../../../room/service/realEstateService"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let realEstateService: RealEstateService
let owner: MobEntity
let bidder: MobEntity
let listing: RealEstateListingEntity

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  realEstateService = app.get<RealEstateService>(Types.RealEstateListingService)
  bidder = (await testRunner.createMob()).get()
  const room = testRunner.getStartRoom().get()
  owner = (await testRunner.createMob()).get()
  room.isOwnable = true
  room.owner = owner
  bidder.gold = 10
  listing = new RealEstateListingEntity()
  listing.agent = owner
  listing.room = room
  listing.offeringPrice = 10
  await realEstateService.createListing(listing)
})

describe("room accept action", () => {
  it("accepts a bid and resolves the transaction", async () => {
    // given
    await testRunner.invokeAction(RequestType.RoomBid, "room bid 10")

    // when
    const response = await testRunner.invokeActionAs(owner, RequestType.RoomBidAccept, `room accept '${bidder.name}'`)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`You accept the bid from ${bidder.name} on Test room 1. You receive 10 gold.`)
  })

  it("refunds bid rejections", async () => {
    // setup
    const initialGold = 20
    const bidder2 = (await testRunner.createMob()).setGold(initialGold).get()

    // given
    const bid = new RealEstateBidEntity()
    bid.amount = 5
    bid.bidder = bidder2
    bid.listing = listing
    bid.status = RealEstateBidStatus.Submitted
    await realEstateService.createBid(bid)

    // when
    await testRunner.invokeActionAs(owner, RequestType.RoomBidAccept, `room accept '${bidder.name}'`)

    // then
    expect(bidder2.gold).toBe(initialGold)
  })

  it("cannot accept a bid for a room that is not owned by the requester", async () => {
    // setup
    const accepter = (await testRunner.createMob()).get()
    await testRunner.invokeAction(RequestType.RoomBid, "room bid 10")

    // when
    const response = await testRunner.invokeActionAs(
      accepter, RequestType.RoomBidAccept, `room accept '${bidder.name}'`)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe("You don't own this room.")
  })

  it("must have a valid matching bid", async () => {
    // when
    const response = await testRunner.invokeActionAs(owner, RequestType.RoomBidAccept, `room accept '${bidder.name}'`)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe("That bid was not found.")
  })

  it("cannot be in a fight", async () => {
    // setup
    await testRunner.fight(owner)

    // when
    const response = await testRunner.invokeActionAs(owner, RequestType.RoomBidAccept, `room accept '${bidder.name}'`)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe("No way! You are fighting.")
  })
})
