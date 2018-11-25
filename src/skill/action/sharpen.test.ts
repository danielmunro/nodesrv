import { AffectType } from "../../affect/affectType"
import doNTimes from "../../support/functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import SkillDefinition from "../skillDefinition"
import { SkillType } from "../skillType"

let testBuilder: TestBuilder
let skillDefinition: SkillDefinition
let mace
let axe

beforeEach(async () => {
  testBuilder = new TestBuilder()
  const mobBuilder = testBuilder.withMob()
  mobBuilder.withSkill(SkillType.Sharpen, MAX_PRACTICE_LEVEL)
  mace = mobBuilder.withMaceEq()
  axe = mobBuilder.withAxeEq()
  mobBuilder.withLevel(10)
  skillDefinition = await testBuilder.getSkillDefinition(SkillType.Sharpen)
})

describe("sharpen skill action", () => {
  it("should error out for weapons without blades", async () => {
    // when
    const response = await skillDefinition.doAction(
      testBuilder.createRequest(RequestType.Sharpen, "sharpen mace", mace))

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.message.getMessageToRequestCreator()).toBe("That weapon needs a blade to sharpen.")
  })

  it("should succeed and fail", async () => {
    await doNTimes(100, async () => {
      // when
      const response = await skillDefinition.doAction(
        testBuilder.createRequest(RequestType.Sharpen, "sharpen axe", axe))

      if (response.isSuccessful()) {
        expect(axe.affects.find(a => a.affectType === AffectType.Sharpened)).toBeTruthy()
        return
      }

      if (response.isFailure()) {
        expect(response.message.getMessageToRequestCreator()).toBe("you fail to sharpen a toy axe.")
        return
      }

      if (response.isError()) {
        expect(response.message.getMessageToRequestCreator()).toBe("That is already sharpened.")
      }
    })
  })
})
