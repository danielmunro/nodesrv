import {AffectType} from "../../../../affect/enum/affectType"
import {newAffect} from "../../../../affect/factory/affectFactory"
import {createTestAppContainer} from "../../../../app/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../spell/spellType"
import doNTimes, {doNTimesOrUntilTruthy} from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let target: MobBuilder
const iterations = 1000

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.createMob()
    .withSpell(SpellType.Slow, MAX_PRACTICE_LEVEL)
    .setLevel(30)
  target = testRunner.createMob()
})

describe("slow spell action", () => {
  it("applies the slow affect", async () => {
    await testRunner.invokeActionSuccessfully(
        RequestType.Cast,
        `cast slow '${target.getMobName()}'`,
        target.get())

    expect(target.hasAffect(AffectType.Slow)).toBeTruthy()
  })

  it("sometimes only strips haste if the target has haste", async () => {
    let slowApplied = 0
    let slowNotApplied = 0
    const aff = target.mob.affect()
    await doNTimes(iterations, async () => {
      aff.reset()
      aff.add(newAffect(AffectType.Haste))

      await testRunner.invokeActionSuccessfully(
          RequestType.Cast,
          `cast slow '${target.getMobName()}'`,
          target.get())

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

      const handled = await testRunner.invokeActionSuccessfully(
          RequestType.Cast,
          `cast slow '${target.getMobName()}'`,
          target.get())

      if (!aff.has(AffectType.Slow)) {
        return handled
      }
    })

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} stops moving quickly.`)
    expect(response.getMessageToTarget()).toBe("you stop moving quickly.")
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} stops moving quickly.`)
  })

  it("generates accurate messages when applying slow", async () => {
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Cast,
        `cast slow '${target.getMobName()}'`,
        target.mob)

    expect(response.getMessageToRequestCreator())
      .toBe(`${target.getMobName()} starts moving in slow motion.`)
    expect(response.getMessageToTarget()).toBe("you start moving in slow motion.")
    expect(response.getMessageToObservers())
      .toBe(`${target.getMobName()} starts moving in slow motion.`)
  })
})
