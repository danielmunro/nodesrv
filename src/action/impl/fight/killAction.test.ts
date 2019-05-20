import {AffectType} from "../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../app/testFactory"
import {allDispositions, Disposition} from "../../../mob/enum/disposition"
import {RequestType} from "../../../request/enum/requestType"
import {ResponseStatus} from "../../../request/enum/responseStatus"
import {getTestMob} from "../../../support/test/mob"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages, MESSAGE_FAIL_CANNOT_ATTACK_SELF, MESSAGE_FAIL_KILL_ALREADY_FIGHTING} from "../../constants"

let testRunner: TestRunner
let mob: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mob = testRunner.createMob()
})

describe("kill action", () => {
  it("cannot kill self", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Kill, `kill ${mob.getMobName()}`)

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FAIL_CANNOT_ATTACK_SELF)
  })

  it("sanity check", async () => {
    // given
    const target = testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(RequestType.Kill, `kill ${target.getMobName()}`)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.getMessageToRequestCreator())
      .toBe(`you scream and attack ${target.getMobName()}!`)
    expect(response.message.getMessageToTarget())
      .toBe(`${mob.getMobName()} screams and attacks you!`)
    expect(response.message.getMessageToObservers())
      .toBe(`${mob.getMobName()} screams and attacks ${target.getMobName()}!`)
  })

  it("should not be able to kill a mob that isn't in the room", async () => {
    // given
    const target = getTestMob()

    // when
    const response = await testRunner.invokeAction(RequestType.Kill, `kill ${target.name}`, target)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Mob.NotFound)
  })

  it("shouldn't be able to target a mob when already fighting", async () => {
    // given
    const mob1 = testRunner.createMob()
    const mob2 = testRunner.createMob()

    // and
    testRunner.fight(mob1.mob)

    // when
    const response = await testRunner.invokeAction(
      RequestType.Kill, `kill ${mob2.getMobName()}`, mob2.mob)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FAIL_KILL_ALREADY_FIGHTING)
  })

  it("should be able to kill a mob in the same room", async () => {
    // given
    const target = testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(
      RequestType.Kill, `kill ${target.getMobName()}`, target.mob)

    // then
    expect(response.isSuccessful()).toBeTruthy()
  })

  it.each(allDispositions)("should require a standing disposition, provided with %s", async disposition => {
    // given
    mob.withDisposition(disposition)
    const target = testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(RequestType.Kill, `kill ${target.getMobName()}`)

    // then
    expect(response.isSuccessful()).toBe(disposition === Disposition.Standing)
  })

  it("fails when the target has orb of touch applied", async () => {
    // given
    const target = testRunner.createMob()
    target.addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testRunner.invokeAction(RequestType.Kill, `kill ${target.getMobName()}`)

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.getMessageToRequestCreator())
      .toBe(`you bounce off of ${target.getMobName()}'s orb of touch.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${mob.getMobName()} bounces off of your orb of touch.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${mob.getMobName()} bounces off of ${target.getMobName()}'s orb of touch.`)
  })
})
