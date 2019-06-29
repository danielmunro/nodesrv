import { AffectType } from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {ItemEntity} from "../../../../item/entity/itemEntity"
import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import { SkillType } from "../../../../mob/skill/skillType"
import { RequestType } from "../../../../request/enum/requestType"
import doNTimes from "../../../../support/functional/times"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 100
let testRunner: TestRunner
let axe: ItemEntity

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  const mobBuilder = testRunner.createMob()
    .withSkill(SkillType.Sharpen, MAX_PRACTICE_LEVEL)
  mobBuilder.addItem(testRunner.createWeapon()
    .asMace()
    .build())
  axe = testRunner.createWeapon()
    .asAxe()
    .build()
  mobBuilder.addItem(axe)
    .setLevel(30)
})

describe("sharpen skill action", () => {
  it("should error out for weapons without blades", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Sharpen, "sharpen mace")

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator())
      .toBe("That weapon needs a blade to sharpen.")
  })

  it("should succeed and fail", async () => {
    await doNTimes(iterations, async () => {
      // when
      const response = await testRunner.invokeAction(RequestType.Sharpen, "sharpen axe")

      if (response.isSuccessful()) {
        expect(axe.affects.find(a => a.affectType === AffectType.Sharpened)).toBeTruthy()
        return
      }

      if (response.isError()) {
        expect(response.message.getMessageToRequestCreator()).toBe("That has already sharpened.")
      }
    })
  })
})
