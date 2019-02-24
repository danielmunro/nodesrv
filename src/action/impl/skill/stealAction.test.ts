import {Item} from "../../../item/model/item"
import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import {SkillType} from "../../../skill/skillType"
import {doNTimesOrUntilTruthy, getSuccessfulAction} from "../../../support/functional/times"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

const STEAL_INPUT = "steal axe bob"
const iterations = 1000
const initialLevel = MAX_PRACTICE_LEVEL * 0.9
let testBuilder: TestBuilder
let action: Action
let mob1: Mob
let mob2: Mob
let item: Item

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Steal)
  const mobBuilder1 = testBuilder.withMob()
  mobBuilder1.withLevel(5)
  mobBuilder1.withSkill(SkillType.Steal, initialLevel)
  mob1 = mobBuilder1.mob

  // and
  const mobBuilder2 = testBuilder.withMob("bob")
  item = testBuilder.withWeapon()
    .asAxe()
    .addToMobBuilder(mobBuilder2)
    .build()
  mob2 = mobBuilder2.mob
})

describe("steal skill action", () => {
  it("should transfer an item when successful", async () => {
    // when
    const response = await getSuccessfulAction(action, testBuilder.createRequest(RequestType.Steal, STEAL_INPUT))

    // then
    await expect(response).toBeDefined()
    expect(mob1.inventory.items).toHaveLength(1)
    expect(mob2.inventory.items).toHaveLength(0)
  })

  it("should generate accurate success messages", async () => {
    // when
    const response = await getSuccessfulAction(action, testBuilder.createRequest(RequestType.Steal, STEAL_INPUT))

    // then
    expect(response.message.getMessageToRequestCreator())
      .toBe(`you steal ${item.name} from ${mob2.name}!`)
    expect(response.message.getMessageToTarget())
      .toBe(`${mob1.name} steals ${item.name} from you!`)
    expect(response.message.getMessageToObservers())
      .toBe(`${mob1.name} steals ${item.name} from ${mob2.name}!`)
  })

  it("should generate accurate fail messages", async () => {
    // when
    const response = await doNTimesOrUntilTruthy(iterations, async () => {
      const handled = await action.handle(testBuilder.createRequest(RequestType.Steal, STEAL_INPUT))
      if (handled.isSuccessful()) {
        mob2.inventory.addItem(mob1.inventory.items[0])
      }
      return handled.isFailure() ? handled : null
    })

    // then
    expect(response.message.getMessageToRequestCreator())
      .toBe(`you fail to steal ${item.name} from ${mob2.name}.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${mob1.name} fails to steal ${item.name} from you.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${mob1.name} fails to steal ${item.name} from ${mob2.name}.`)
  })
})
