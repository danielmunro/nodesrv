import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"
import Action from "../../../action"

let testBuilder: TestBuilder
let action: Action
let target: MobBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getAction(RequestType.Peek)
  testBuilder.withMob()
    .setLevel(30)
    .withSkill(SkillType.Peek, MAX_PRACTICE_LEVEL)

  // and
  target = testBuilder.withMob()
  testBuilder.withWeapon()
    .asAxe()
    .addToMobBuilder(target)
    .build()
  testBuilder.withItem()
    .asShield()
    .addToMobBuilder(target)
    .build()
})

describe("peek skill action", () => {
  it("displays contents of a target's inventory", async () => {
    // when
    const response = await getSuccessfulAction(
      action,
      testBuilder.createRequest(
        RequestType.Peek,
        `peek '${target.getMobName()}'`,
        target.mob))

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()}'s inventory:
a wood chopping axe
a wooden practice shield
`)
  })
})
