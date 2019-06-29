import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import MobService from "../../../../mob/service/mobService"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import {getTestMob} from "../../../../support/test/mob"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {SKELETAL_WARRIOR_ID} from "./summonUndeadAction"

let testRunner: TestRunner
let mobService: MobService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  testRunner.createMob()
    .setLevel(30)
    .withSpell(SpellType.SummonUndead, MAX_PRACTICE_LEVEL)

  const skeletalWarrior = getTestMob()
  skeletalWarrior.id = SKELETAL_WARRIOR_ID

  mobService = app.get<MobService>(Types.MobService)
  mobService.mobTemplateTable.add(skeletalWarrior)
})

describe("summon undead spell action", () => {
  it("generates a skeleton warrior", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast 'summon undead'")

    // then
    expect(mobService.getMobsByRoom(testRunner.getStartRoom().get())).toHaveLength(2)
  })

  it("creates accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast 'summon undead'")

    // then
    expect(response.getMessageToRequestCreator()).toBe(SpellMessages.SummonUndead.Success)
    expect(response.getMessageToTarget()).toBe(SpellMessages.SummonUndead.Success)
    expect(response.getMessageToObservers()).toBe(SpellMessages.SummonUndead.Success)
  })
})
