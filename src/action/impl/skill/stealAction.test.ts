import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import {SkillType} from "../../../skill/skillType"
import doNTimes from "../../../support/functional/times"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

const iterations = 1000
let testBuilder: TestBuilder
let action: Action
let mob1: Mob
let mob2: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Steal)
  const mobBuilder1 = testBuilder.withMob()
  mobBuilder1.withLevel(5)
  mobBuilder1.withSkill(SkillType.Steal, MAX_PRACTICE_LEVEL)
  mob1 = mobBuilder1.mob

  // and
  const mobBuilder2 = testBuilder.withMob()
  mobBuilder2.withAxeEq()
  mobBuilder2.mob.name = "bob"
  mob2 = mobBuilder2.mob
})

describe("steal skill action", () => {
  it("should transfer an item when successful", async () => {
    await doNTimes(iterations, async () => {
      // when
      const response = await action.handle(testBuilder.createRequest(
        RequestType.Steal,
        "steal axe bob",
        mob2))

      // then
      expect(response.isError()).toBeFalsy()
      expect(mob1.inventory.items).toHaveLength(response.isSuccessful() ? 1 : 0)
      expect(mob2.inventory.items).toHaveLength(response.isSuccessful() ? 0 : 1)
    })
  })

  it("should generate accurate messages", async () => {
    // when
    const responses = await doNTimes(iterations, () =>
      action.handle(testBuilder.createRequest(RequestType.Steal, "steal axe bob", mob2)))

    // then
    const successMessage = responses.find(response => response.isSuccessful()).message
    expect(successMessage.getMessageToRequestCreator())
      .toBe(`you steal a toy axe from ${mob2.name}!`)
    expect(successMessage.getMessageToTarget())
      .toBe(`${mob1.name} steals a toy axe from you!`)
    expect(successMessage.getMessageToObservers())
      .toBe(`${mob1.name} steals a toy axe from ${mob2.name}!`)

    // and
    const failMessage = responses.find(response => !response.isSuccessful()).message
    expect(failMessage.getMessageToRequestCreator())
      .toBe(`you fail to steal a toy axe from ${mob2.name}.`)
    expect(failMessage.getMessageToTarget())
      .toBe(`${mob1.name} fails to steal a toy axe from you.`)
    expect(failMessage.getMessageToObservers())
      .toBe(`${mob1.name} fails to steal a toy axe from ${mob2.name}.`)
  })
})
