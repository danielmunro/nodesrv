import { AffectType } from "../../../affect/affectType"
import {Item} from "../../../item/model/item"
import { MAX_PRACTICE_LEVEL } from "../../../mob/constants"
import { RequestType } from "../../../request/requestType"
import { SkillType } from "../../../skill/skillType"
import doNTimes from "../../../support/functional/times"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

let testBuilder: TestBuilder
let action: Action
let axe: Item

beforeEach(async () => {
  testBuilder = new TestBuilder()
  const mobBuilder = testBuilder.withMob()
  mobBuilder.withSkill(SkillType.Sharpen, MAX_PRACTICE_LEVEL)
  testBuilder.withWeapon()
    .asMace()
    .addToMobBuilder(mobBuilder)
    .build()
  axe = testBuilder.withWeapon()
    .asAxe()
    .addToMobBuilder(mobBuilder)
    .build()
  mobBuilder.withLevel(10)
  action = await testBuilder.getAction(RequestType.Sharpen)
})

describe("sharpen skill action", () => {
  it("should error out for weapons without blades", async () => {
    // when
    const response = await action.handle(
      testBuilder.createRequest(RequestType.Sharpen, "sharpen mace"))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator())
      .toBe("That weapon needs a blade to sharpen.")
  })

  it("should succeed and fail", async () => {
    await doNTimes(100, async () => {
      // when
      const response = await action.handle(
        testBuilder.createRequest(RequestType.Sharpen, "sharpen axe"))

      if (response.isSuccessful()) {
        expect(axe.affects.find(a => a.affectType === AffectType.Sharpened)).toBeTruthy()
        return
      }

      if (response.isError()) {
        expect(response.message.getMessageToRequestCreator()).toBe("That is already sharpened.")
      }
    })
  })
})
