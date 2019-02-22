import {CheckStatus} from "../../../check/checkStatus"
import {allDispositions, Disposition} from "../../../mob/enum/disposition"
import { RequestType } from "../../../request/requestType"
import {getSuccessfulAction} from "../../../support/functional/times"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {
  MESSAGE_FAIL_NOT_FIGHTING,
  } from "../../constants"
import {MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE, MESSAGE_FAIL_TOO_TIRED} from "../../constants"

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
    await getSuccessfulAction(definition, testBuilder.createRequest(RequestType.Flee))

    // then
    expect(service.mobService.findFight(f => f.isInProgress())).toBeUndefined()
  })

  it("flee should cause the fleeing mob to change rooms", async () => {
    // when
    await getSuccessfulAction(definition, testBuilder.createRequest(RequestType.Flee))

    // then
    const service = await testBuilder.getService()
    expect(service.getMobLocation(mob).room).toBe(room2)
  })

  it("flee should accurately build its response message", async () => {
    // setup
    mob.name = "bob"

    // when
    const response = await getSuccessfulAction(definition, testBuilder.createRequest(RequestType.Flee))

    // then
    expect(response.message.getMessageToRequestCreator()).toContain("you flee to the")
    expect(response.message.getMessageToTarget()).toContain("bob flees to the")
  })

  it("should not work if the mob is not fighting", async () => {
    // when
    testBuilder = new TestBuilder()
    testBuilder.withRoom()
    await testBuilder.withPlayer()
    const check = await definition.check(testBuilder.createRequest(RequestType.Flee))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NOT_FIGHTING)
  })

  it("should not work if no exits available", async () => {
    // given
    testBuilder = new TestBuilder()
    testBuilder.withRoom()
    await testBuilder.withPlayer()
    await testBuilder.fight()
    definition = await testBuilder.getActionDefinition(RequestType.Flee)

    // when
    const check = await definition.check(testBuilder.createRequest(RequestType.Flee))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE)
  })

  it("should not work if a mob has no movement", async () => {
    // given
    mob.vitals.mv = 0

    // when
    const check = await definition.check(testBuilder.createRequest(RequestType.Flee))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_TOO_TIRED)
  })

  it("should work if all preconditions met", async () => {
    // when
    const check = await definition.check(testBuilder.createRequest(RequestType.Flee))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })

  it.each(allDispositions)("should require a standing disposition, provided with %s", async disposition => {
    // given
    mob.disposition = disposition

    // when
    const check = await definition.check(testBuilder.createRequest(RequestType.Flee))

    // then
    expect(check.status).toBe(disposition === Disposition.Standing ? CheckStatus.Ok : CheckStatus.Failed)
  })
})
