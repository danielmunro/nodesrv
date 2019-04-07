import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder
const expectedMessage = "you feel more powerful than death."

beforeEach(() => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob()
})

describe("withstand death spell action", () => {
  it("imparts withstand death affect type", async () => {
    // given
    caster.withSpell(SpellType.WithstandDeath, MAX_PRACTICE_LEVEL).setLevel(30)

    // when
    await testBuilder.successfulAction(testBuilder.createRequest(RequestType.Cast, "cast withstand", caster.mob))

    // then
    expect(caster.hasAffect(AffectType.WithstandDeath)).toBeTruthy()
  })

  it("generates accurate success messages on self", async () => {
    // given
    caster.withSpell(SpellType.WithstandDeath, MAX_PRACTICE_LEVEL).setLevel(30)

    // when
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast withstand", caster.mob))

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${caster.getMobName()} feels more powerful than death.`)
  })

  it("generates accurate success messages on a target", async () => {
    // given
    caster.withSpell(SpellType.WithstandDeath, MAX_PRACTICE_LEVEL).setLevel(30)
    const target = testBuilder.withMob()

    // when
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, `cast withstand ${target.getMobName()}`, target.mob))

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} feels more powerful than death.`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} feels more powerful than death.`)
  })
})
