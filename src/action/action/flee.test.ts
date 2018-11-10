import doNTimes from "../../functional/times"
import { getFights } from "../../mob/fight/fight"
import { RequestType } from "../../request/requestType"
import { Direction } from "../../room/constants"
import { newReciprocalExit } from "../../room/factory"
import TestBuilder from "../../test/testBuilder"

let definition
let mob
let player
let room1
let room2
let testBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  const playerBuilder = await testBuilder.withPlayer()
  player = playerBuilder.player
  mob = player.sessionMob
  // room with a fight
  room1 = testBuilder.withRoom().room
  // room to flee to
  room2 = testBuilder.withRoom().room
  testBuilder.addExit(...newReciprocalExit(room1, room2, Direction.East))
  await testBuilder.fight()
  const actionCollection = await testBuilder.getActionCollection()
  definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Flee)
})

describe("flee action handler", () => {
  it("flee should stop a fight", async () => {
    // verify
    expect(getFights().filter(f => f.isInProgress()).length).toBe(1)

    // when
    const responses = await doNTimes(10, async () =>
      definition.handle(testBuilder.createRequest(RequestType.Flee)))
    const successfulResponse = responses.find(response => response.isSuccessful())

    // then
    expect(successfulResponse).toBeTruthy()
    expect(getFights().filter(f => f.isInProgress()).length).toBe(0)
  })

  it("flee should cause the fleeing mob to change rooms", async () => {
    // when
    const responses = await doNTimes(10, async () =>
      definition.handle(testBuilder.createRequest(RequestType.Flee)))
    const successResponse = responses.find(response => response.isSuccessful())

    // then
    expect(successResponse).toBeTruthy()
    expect(mob.room.uuid).toBe(room2.uuid)
  })

  it("flee should accurately build its response message", async () => {
    // setup
    mob.name = "bob"

    // when
    const responses = await doNTimes(10, async () =>
      definition.handle(testBuilder.createRequest(RequestType.Flee)))

    const response = responses.find(r => r.isSuccessful())

    // then
    expect(response.message.getMessageToRequestCreator()).toContain("you flee to the")
    expect(response.message.getMessageToTarget()).toContain("bob flees to the")
  })
})
