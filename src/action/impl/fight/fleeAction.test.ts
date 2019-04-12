import {CheckStatus} from "../../../check/checkStatus"
import {allDispositions, Disposition} from "../../../mob/enum/disposition"
import {Mob} from "../../../mob/model/mob"
import { RequestType } from "../../../request/requestType"
import {getSuccessfulAction} from "../../../support/functional/times"
import RoomBuilder from "../../../support/test/roomBuilder"
import TestBuilder from "../../../support/test/testBuilder"
import Action from "../../action"
import {
  ConditionMessages,
  MESSAGE_FAIL_NOT_FIGHTING,
} from "../../constants"
import {MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE} from "../../constants"

let action: Action
let mob: Mob
let player
let room2: RoomBuilder
let testBuilder: TestBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  // room with a fight
  testBuilder.withRoom()
  const playerBuilder = await testBuilder.withPlayer()
  player = playerBuilder.player
  mob = player.sessionMob
  // room to flee to
  room2 = testBuilder.withRoom()
  await testBuilder.fight()
  action = await testBuilder.getAction(RequestType.Flee)
})

describe("flee action handler", () => {
  it("flee should stop a fight", async () => {
    const mobService = await testBuilder.getMobService()

    // verify
    expect(mobService.findFight(f => f.isInProgress())).toBeTruthy()

    // when
    await getSuccessfulAction(action, testBuilder.createRequest(RequestType.Flee))

    // then
    expect(mobService.findFight(f => f.isInProgress())).toBeUndefined()
  })

  it("flee should cause the fleeing mob to change rooms", async () => {
    // when
    await getSuccessfulAction(action, testBuilder.createRequest(RequestType.Flee))

    // then
    const service = await testBuilder.getService()
    expect(service.getMobLocation(mob).room).toBe(room2.room)
  })

  it("flee should accurately build its response message", async () => {
    // setup
    mob.name = "bob"

    // when
    const response = await getSuccessfulAction(action, testBuilder.createRequest(RequestType.Flee))

    // then
    expect(response.getMessageToRequestCreator()).toContain("you flee to the")
    expect(response.message.getMessageToTarget()).toContain("bob flees to the")
  })

  it("should not work if the mob has not fighting", async () => {
    // when
    testBuilder = new TestBuilder()
    testBuilder.withRoom()
    await testBuilder.withPlayer()
    const check = await action.check(testBuilder.createRequest(RequestType.Flee))

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
    action = await testBuilder.getAction(RequestType.Flee)

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Flee))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE)
  })

  it("should not work if a mob has no movement", async () => {
    // given
    mob.vitals.mv = 0

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Flee))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.Move.Fail.OutOfMovement)
  })

  it("should work if all preconditions met", async () => {
    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Flee))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })

  it.each(allDispositions)("should require a standing disposition, provided with %s", async disposition => {
    // given
    mob.disposition = disposition

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Flee))

    // then
    expect(check.status).toBe(disposition === Disposition.Standing ? CheckStatus.Ok : CheckStatus.Failed)
  })

  it("renders help text", async () => {
    expect(action.getHelpText()).toBe(`Once you start a fight, you can't just walk away from it.  If the fight
is not going well, you can attempt to FLEE, or another character can
RESCUE you.  (You can also RECALL, but this is less likely to work,
and costs more experience points, then fleeing).

If you lose your link during a fight, then your character will keep
fighting, and will attempt to RECALL from time to time.  Your chances
of making the recall are reduced, and you will lose much more experience.`)
  })
})
