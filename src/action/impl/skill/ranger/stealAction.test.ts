import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/testFactory"
import {Item} from "../../../../item/model/item"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SkillType} from "../../../../skill/skillType"
import {doNTimesOrUntilTruthy} from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 10000
const initialLevel = MAX_PRACTICE_LEVEL * 0.9
let testRunner: TestRunner
let mob1: MobBuilder
let mob2: MobBuilder
let item: Item

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mob1 = testRunner.createMob()
    .setLevel(5)
    .withSkill(SkillType.Steal, initialLevel)

  // and
  mob2 = testRunner.createMob()
  item = testRunner.createWeapon()
    .asAxe()
    .build()
  mob2.addItem(item)
})

describe("steal skill action", () => {
  it("should transfer an item when successful", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Steal, `steal axe '${mob2.getMobName()}'`)

    // then
    expect(response).toBeDefined()
    expect(mob1.getItems()).toHaveLength(1)
    expect(mob2.getItems()).toHaveLength(0)
  })

  it("should generate accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Steal, `steal axe '${mob2.getMobName()}'`)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you steal ${item.name} from ${mob2.getMobName()}!`)
    expect(response.getMessageToTarget())
      .toBe(`${mob1.getMobName()} steals ${item.name} from you!`)
    expect(response.getMessageToObservers())
      .toBe(`${mob1.getMobName()} steals ${item.name} from ${mob2.getMobName()}!`)
  })

  it("bounces off an orb of touch", async () => {
    // given
    mob2.addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await doNTimesOrUntilTruthy(iterations, async () => {
      const handled = await testRunner.invokeAction(RequestType.Steal, `steal axe '${mob2.getMobName()}'`)
      return handled.isFailure() &&
        !handled.getMessageToRequestCreator().includes("you fail") ? handled : null
    })

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you bounce off of ${mob2.getMobName()}'s orb of touch.`)
    expect(response.getMessageToTarget())
      .toBe(`${mob1.getMobName()} bounces off of your orb of touch.`)
    expect(response.getMessageToObservers())
      .toBe(`${mob1.getMobName()} bounces off of ${mob2.getMobName()}'s orb of touch.`)
  })

  it("should generate accurate fail messages", async () => {
    // given
    mob1.get().skills[0].level = 1

    // when
    const response = await doNTimesOrUntilTruthy(iterations, async () => {
      const handled = await testRunner.invokeAction(RequestType.Steal, `steal axe '${mob2.getMobName()}'`)
      if (handled.isSuccessful()) {
        mob2.addItem(mob1.getItems()[0])
      }
      return handled.isFailure() ? handled : null
    })

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you fail to steal ${item.name} from ${mob2.getMobName()}.`)
    expect(response.getMessageToTarget())
      .toBe(`${mob1.getMobName()} fails to steal ${item.name} from you.`)
    expect(response.getMessageToObservers())
      .toBe(`${mob1.getMobName()} fails to steal ${item.name} from ${mob2.getMobName()}.`)
  })
})
