import {AffectType} from "../../affect/enum/affectType"
import {createTestAppContainer} from "../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import {RequestType} from "../../request/enum/requestType"
import {SkillType} from "../../mob/skill/skillType"
import doNTimes from "../../support/functional/times"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"

const iterations = 1000

describe("skill action", () => {
  it("has less effective when affected by 'forget'", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)

    // given
    const mob1 = testRunner.createMob()
      .setLevel(30)
      .addAffectType(AffectType.Forget)
      .withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)

    // when
    const responses1 = await doNTimes(
      iterations,
      async () => {
        mob1.setMv(100)
        return testRunner.invokeAction(RequestType.Berserk)
      })

    const mob2 = testRunner.createAndSetMainMob()
      .setLevel(30)
      .withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)
    const responses2 = await doNTimes(
      iterations,
      async () => {
        mob2.setMv(100)
        return testRunner.invokeAction(RequestType.Berserk)
    })

    // then
    const responseGroup1SuccessCount = responses1.filter(response => response.isSuccessful()).length
    const responseGroup2SuccessCount = responses2.filter(response => response.isSuccessful()).length
    expect(responseGroup1SuccessCount)
      .toBeLessThan(responseGroup2SuccessCount)
  })
})
