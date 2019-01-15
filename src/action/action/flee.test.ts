import { RequestType } from "../../request/requestType"
import doNTimes from "../../support/functional/times"
import TestBuilder from "../../test/testBuilder"
import {Action} from "../action"

let definition: Action
let mob
let player
let room1
let room2
let testBuilder: TestBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  const playerBuilder = await testBuilder.withPlayer()
  player = playerBuilder.player
  mob = player.sessionMob
  // room with a fight
  room1 = testBuilder.withRoom().room
  // room to flee to
  room2 = testBuilder.withRoom().room
  await testBuilder.fight()
  definition = await testBuilder.getActionDefinition(RequestType.Flee)
})

describe("flee action handler", () => {
  it("flee should stop a fight", async () => {
    const service = await testBuilder.getService()

    // verify
    expect(service.mobService.findFight(f => f.isInProgress())).toBeTruthy()

    // when
    const responses = await doNTimes(10, async () =>
      definition.handle(testBuilder.createRequest(RequestType.Flee)))
    const successfulResponse = responses.find(response => response.isSuccessful())

    // then
    expect(successfulResponse).toBeTruthy()
    expect(service.mobService.findFight(f => f.isInProgress())).toBeUndefined()
  })

  it("flee should cause the fleeing mob to change rooms", async () => {
    // when
    const responses = await doNTimes(10, async () =>
      definition.handle(testBuilder.createRequest(RequestType.Flee)))
    const successResponse = responses.find(response => response.isSuccessful())

    // then
    expect(successResponse).toBeTruthy()

    const service = await testBuilder.getService()
    expect(service.getMobLocation(mob).room).toBe(room2)
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
