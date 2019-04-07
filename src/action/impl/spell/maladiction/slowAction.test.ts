import {AffectType} from "../../../../affect/affectType"
import {newAffect} from "../../../../affect/factory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import doNTimes, {doNTimesOrUntilTruthy} from "../../../../support/functional/times"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"

let testBuilder: TestBuilder
let target: MobBuilder
const iterations = 1000

beforeEach(() => {
  testBuilder = new TestBuilder()
  testBuilder.withMob().withSpell(SpellType.Slow, MAX_PRACTICE_LEVEL).setLevel(30)
  target = testBuilder.withMob()
})

describe("slow spell action", () => {
  it("applies the slow affect", async () => {
    await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Cast,
        `cast slow '${target.getMobName()}'`,
        target.mob))

    expect(target.hasAffect(AffectType.Slow)).toBeTruthy()
  })

  it("sometimes only strips haste if the target has haste", async () => {
    let slowApplied = 0
    let slowNotApplied = 0
    const aff = target.mob.affect()
    await doNTimes(iterations, async () => {
      aff.reset()
      aff.add(newAffect(AffectType.Haste))

      await testBuilder.successfulAction(
        testBuilder.createRequest(
          RequestType.Cast,
          `cast slow '${target.getMobName()}'`,
          target.mob))

      if (aff.has(AffectType.Slow)) {
        slowApplied++
      } else {
        slowNotApplied++
      }
    })

    expect(slowApplied).toBeGreaterThan(iterations * 0.1)
    expect(slowNotApplied).toBeGreaterThan(iterations * 0.1)
  })

  it("generates accurate messages when just stripping haste", async () => {
    const aff = target.mob.affect()
    const response = await doNTimesOrUntilTruthy(iterations, async () => {
      aff.reset()
      aff.add(newAffect(AffectType.Haste))

      const handled = await testBuilder.successfulAction(
        testBuilder.createRequest(
          RequestType.Cast,
          `cast slow '${target.getMobName()}'`,
          target.mob))

      if (!aff.has(AffectType.Slow)) {
        return handled
      }
    })

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} stops moving quickly.`)
    expect(response.message.getMessageToTarget()).toBe("you stop moving quickly.")
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} stops moving quickly.`)
  })

  it("generates accurate messages when applying slow", async () => {
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Cast,
        `cast slow '${target.getMobName()}'`,
        target.mob))

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} starts moving in slow motion.`)
    expect(response.message.getMessageToTarget()).toBe("you start moving in slow motion.")
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} starts moving in slow motion.`)
  })
})
