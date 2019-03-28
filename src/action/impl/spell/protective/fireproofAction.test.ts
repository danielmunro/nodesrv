import {AffectType} from "../../../../affect/affectType"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder
const expectedMessage = "you glow with a blue aura."

beforeEach(() => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob().setLevel(30).withSpell(SpellType.Fireproof)
})

describe("fireproof action", () => {
  it("adds fireproof affect to the target", async () => {
    await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast fireproof", caster.mob))

    expect(caster.hasAffect(AffectType.Fireproof)).toBeTruthy()
  })

  it("generates accurate success messages on self", async () => {
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast fireproof", caster.mob))

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${caster.getMobName()} glows with a blue aura.`)
  })

  it("generates accurate success messages on a target", async () => {
    const target = testBuilder.withMob()
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, `cast fireproof '${target.getMobName()}'`, target.mob))

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} glows with a blue aura.`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} glows with a blue aura.`)
  })
})
