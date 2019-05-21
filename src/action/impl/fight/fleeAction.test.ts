import {createTestAppContainer} from "../../../app/factory/testFactory"
import {allDispositions, Disposition} from "../../../mob/enum/disposition"
import {Fight} from "../../../mob/fight/fight"
import {Mob} from "../../../mob/model/mob"
import LocationService from "../../../mob/service/locationService"
import MobService from "../../../mob/service/mobService"
import { RequestType } from "../../../request/enum/requestType"
import RoomBuilder from "../../../support/test/roomBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE} from "../../constants"
import {
  ConditionMessages,
  MESSAGE_FAIL_NOT_FIGHTING,
} from "../../constants"

let mob: Mob
let player
let room2: RoomBuilder
let testRunner: TestRunner
let locationService: LocationService
let mobService: MobService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  locationService = app.get<LocationService>(Types.LocationService)
  mobService = app.get<MobService>(Types.MobService)
  room2 = testRunner.createRoom()
  const playerBuilder = testRunner.createPlayer()
  player = playerBuilder.player
  mob = player.sessionMob
  testRunner.fight(testRunner.createMob().mob)
})

describe("flee action handler", () => {
  it("flee should stop a fight", async () => {
    // verify
    expect(mobService.findFightForMob(mob)).toBeDefined()

    // when
    await testRunner.invokeActionSuccessfully(RequestType.Flee)

    // then
    expect((mobService.findFightForMob(mob) as Fight).isInProgress()).toBeFalsy()
  })

  it("flee should cause the fleeing mob to change rooms", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Flee)

    // then
    expect(locationService.getRoomForMob(mob)).toBe(room2.room)
  })

  it("flee should accurately build its response message", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Flee)

    // then
    expect(response.getMessageToRequestCreator()).toContain("you flee to the")
    expect(response.getMessageToTarget()).toContain(`${mob.name} flees to the`)
    expect(response.getMessageToObservers()).toContain(`${mob.name} flees to the`)
  })

  it("should not work if the mob has not fighting", async () => {
    // given
    testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)

    // when
    const response = await testRunner.invokeAction(RequestType.Flee)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FAIL_NOT_FIGHTING)
  })

  it("should not work if no exits available", async () => {
    // given
    testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    testRunner.createMob()
    testRunner.fight(testRunner.createMob().mob)

    // when
    const response = await testRunner.invokeAction(RequestType.Flee)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE)
  })

  it("should not work if a mob has no movement", async () => {
    // given
    mob.vitals.mv = 0

    // when
    const response = await testRunner.invokeAction(RequestType.Flee)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Move.Fail.OutOfMovement)
  })

  it("should work if all preconditions met", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Flee)

    // then
    expect(response.isError()).toBeFalsy()
  })

  it.each(allDispositions)("should require a standing disposition, provided with %s", async disposition => {
    // given
    mob.disposition = disposition

    // when
    const response = await testRunner.invokeAction(RequestType.Flee)

    // then
    expect(response.isError()).toBe(disposition !== Disposition.Standing)
  })

  it("renders help text", async () => {
    const response = await testRunner.invokeAction(RequestType.Help, "help flee")
    expect(response.getMessageToRequestCreator()).toBe(`syntax: flee

Once you start a fight, you can't just walk away from it.  If the fight
is not going well, you can attempt to FLEE, or another character can
RESCUE you.  (You can also RECALL, but this is less likely to work,
and costs more experience points, then fleeing).

If you lose your link during a fight, then your character will keep
fighting, and will attempt to RECALL from time to time.  Your chances
of making the recall are reduced, and you will lose much more experience.`)
  })
})
