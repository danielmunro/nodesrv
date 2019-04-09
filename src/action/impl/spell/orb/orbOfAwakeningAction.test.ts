import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder
const expectedMessage = "you are surrounded by an orb of awakening."

beforeEach(() => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob()
    .withSpell(SpellType.OrbOfAwakening, MAX_PRACTICE_LEVEL)
    .setLevel(30)
})

describe("orb of awakening spell action", () => {
  it("imparts orb of awakening affect", async () => {
    await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast 'orb of awakening'", caster.mob))

    expect(caster.hasAffect(AffectType.OrbOfAwakening)).toBeTruthy()
  })

  it("generates accurate success messages when casting on self", async () => {
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast 'orb of awakening'", caster.mob))

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers())
      .toBe(`${caster.getMobName()} is surrounded by an orb of awakening.`)
  })

  it("generates accurate success messages when casting on a target", async () => {
    const target = testBuilder.withMob()

    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Cast,
        `cast 'orb of awakening' ${target.getMobName()}`,
        target.mob))

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} is surrounded by an orb of awakening.`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers())
      .toBe(`${target.getMobName()} is surrounded by an orb of awakening.`)
  })
})
