import {AffectType} from "../../../affect/affectType"
import {CheckStatus} from "../../../check/checkStatus"
import {allDispositions, Disposition} from "../../../mob/enum/disposition"
import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import {ResponseStatus} from "../../../request/responseStatus"
import {getTestMob} from "../../../support/test/mob"
import TestBuilder from "../../../support/test/testBuilder"
import Action from "../../action"
import {ConditionMessages, MESSAGE_FAIL_CANNOT_ATTACK_SELF, MESSAGE_FAIL_KILL_ALREADY_FIGHTING} from "../../constants"

let testBuilder: TestBuilder
let action: Action
let mob: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getAction(RequestType.Kill)
  mob = (await testBuilder.withPlayer()).player.sessionMob
})

describe("kill action", () => {
  it("cannot kill self", async () => {
    // when
    const response = await testBuilder.handleAction(RequestType.Kill, `kill ${mob.name}`)

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FAIL_CANNOT_ATTACK_SELF)
  })

  it("should be able to kill a mob in the same room", async () => {
    // given
    mob.name = "alice"
    const target = testBuilder.withMob("bob").mob

    // when
    const response = await testBuilder.handleAction(RequestType.Kill, `kill ${target.name}`)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe("you scream and attack bob!")
    expect(response.message.getMessageToTarget()).toBe("alice screams and attacks you!")
    expect(response.message.getMessageToObservers()).toBe("alice screams and attacks bob!")
  })

  it("should not be able to kill a mob that isn't in the room", async () => {
    // given
    const target = getTestMob()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Kill, `kill ${target.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.All.Mob.NotFound)
  })

  it("shouldn't be able to target a mob when already fighting", async () => {
    // given
    const mob1 = testBuilder.withMob("bob").mob
    const mob2 = testBuilder.withMob("alice").mob

    // and
    await testBuilder.fight(mob1)

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Kill, `kill ${mob2.name}`, mob2))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_KILL_ALREADY_FIGHTING)
  })

  it("should be able to kill a mob in the same room", async () => {
    // given
    const target = testBuilder.withMob("bob").mob

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Kill, `kill ${target.name}`, target))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result.id).toBe(target.id)
  })

  it.each(allDispositions)("should require a standing disposition, provided with %s", async disposition => {
    // given
    mob.disposition = disposition
    testBuilder.withMob("bob")

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Kill, "kill bob"))

    // then
    expect(check.status).toBe(disposition === Disposition.Standing ? CheckStatus.Ok : CheckStatus.Failed)
  })

  it("fails when the target has orb of touch applied", async () => {
    // given
    mob.name = "alice"
    const target = testBuilder.withMob()
    target.addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testBuilder.handleAction(RequestType.Kill, `kill ${target.getMobName()}`)

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.getMessageToRequestCreator())
      .toBe(`you bounce off of ${target.getMobName()}'s orb of touch.`)
    expect(response.message.getMessageToTarget())
      .toBe("alice bounces off of your orb of touch.")
    expect(response.message.getMessageToObservers())
      .toBe(`alice bounces off of ${target.getMobName()}'s orb of touch.`)
  })
})
