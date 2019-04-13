import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import MobService from "../../../../mob/mobService"
import {RequestType} from "../../../../request/requestType"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import {getTestMob} from "../../../../support/test/mob"
import TestBuilder from "../../../../support/test/testBuilder"
import {SKELETAL_WARRIOR_ID} from "./summonUndeadAction"

let testBuilder: TestBuilder
let mobService: MobService

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobService = await testBuilder.getMobService()
  testBuilder.withMob().setLevel(30).withSpell(SpellType.SummonUndead, MAX_PRACTICE_LEVEL)

  const skeletalWarrior = getTestMob()
  skeletalWarrior.id = SKELETAL_WARRIOR_ID
  mobService.mobTemplateTable.add(skeletalWarrior)
})

describe("summon undead spell action", () => {
  it("generates a skeleton warrior", async () => {
    // when
    await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast 'summon undead'"))

    // then
    expect(mobService.getMobsByRoom(testBuilder.room)).toHaveLength(2)
  })

  it("creates accurate success messages", async () => {
    // when
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast 'summon undead'"))

    // then
    expect(response.getMessageToRequestCreator()).toBe(SpellMessages.SummonUndead.Success)
    expect(response.message.getMessageToTarget()).toBe(SpellMessages.SummonUndead.Success)
    expect(response.message.getMessageToObservers()).toBe(SpellMessages.SummonUndead.Success)
  })
})
