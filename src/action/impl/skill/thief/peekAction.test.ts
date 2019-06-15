import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SkillType} from "../../../../skill/skillType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let target: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.createMob()
    .setLevel(30)
    .withSkill(SkillType.Peek, MAX_PRACTICE_LEVEL)

  // and
  target = testRunner.createMob()
    .addItem(testRunner.createWeapon()
    .asAxe()
    .build())
    .addItem(testRunner.createItem()
    .asShield()
    .build())
})

describe("peek skill action", () => {
  it("displays contents of a target's inventory", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Peek,
        `peek '${target.getMobName()}'`,
        target.mob)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()}'s inventory:
a wood chopping axe
a wooden practice shield
`)
  })
})
