import {AffectType} from "../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {ResponseStatus} from "../../../messageExchange/enum/responseStatus"
import {allDispositions, Disposition} from "../../../mob/enum/disposition"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner
let mob: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mob = await testRunner.createMob()
})

describe("kill action", () => {
  it("cannot kill self", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Kill, `kill ${mob.getMobName()}`)

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Mob.CannotAttackSelf)
  })

  it("sanity check", async () => {
    // given
    const target = await testRunner.createMob()

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
    const room = testRunner.createRoom()
    const target = await testRunner.createMob(room.get())

    // when
    const response = await testRunner.invokeAction(RequestType.Kill, `kill ${target.getMobName()}`, target.get())

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Mob.NotFound)
  })

  it("shouldn't be able to target a mob when already fighting", async () => {
    // given
    const mob1 = await testRunner.createMob()
    const mob2 = await testRunner.createMob()

    // and
    await testRunner.fight(mob1.mob)

    // when
    const response = await testRunner.invokeAction(
      RequestType.Kill, `kill ${mob2.getMobName()}`, mob2.mob)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Mob.Fighting)
  })

  it("should be able to kill a mob in the same room", async () => {
    // given
    const target = await testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(
      RequestType.Kill, `kill ${target.getMobName()}`, target.mob)

    // then
    expect(response.isSuccessful()).toBeTruthy()
  })

  it.each(allDispositions)("should require a standing disposition, provided with %s", async disposition => {
    // given
    mob.withDisposition(disposition)
    const target = await testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(RequestType.Kill, `kill ${target.getMobName()}`)

    // then
    expect(response.isSuccessful()).toBe(disposition === Disposition.Standing)
  })

  it("fails when the target has orb of touch applied", async () => {
    // given
    const target = await testRunner.createMob()
    target.addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testRunner.invokeAction(RequestType.Kill, `kill ${target.getMobName()}`)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you bounce off of ${target.getMobName()}'s orb of touch.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${mob.getMobName()} bounces off of your orb of touch.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${mob.getMobName()} bounces off of ${target.getMobName()}'s orb of touch.`)
    expect(response.status).toBe(ResponseStatus.ActionFailed)
  })
})
