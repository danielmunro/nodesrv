import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder
const expectedMessage = "you feel refreshed."

beforeEach(() => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob().setLevel(30).withSpell(SpellType.RefreshMovement, MAX_PRACTICE_LEVEL)
})

describe("refresh spell action", () => {
  it("generates mv for a target", async () => {
    // given
    caster.setMv(1)

    // when
    await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast refresh", caster.mob))

    // then
    expect(caster.mob.vitals.mv).toBeGreaterThan(1)
  })

  it("generates correct success messages on self", async () => {
    // when
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast refresh", caster.mob))

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${caster.getMobName()} feels refreshed.`)
  })

  it("generates correct success messages on target", async () => {
    const target = testBuilder.withMob()

    // when
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Cast,
        `cast refresh '${target.getMobName()}'`,
        target.mob))

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} feels refreshed.`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} feels refreshed.`)
  })
})
