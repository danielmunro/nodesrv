import {AffectType} from "../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import {RequestType} from "../../request/requestType"
import {SkillType} from "../../skill/skillType"
import doNTimes from "../../support/functional/times"
import TestBuilder from "../../test/testBuilder"

const iterations = 1000

describe("skill action", () => {
  it("is less effective when affected by 'forget'", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const mob1 = testBuilder.withMob()
      .setLevel(30)
      .addAffectType(AffectType.Forget)
      .withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)
    const mob2 = testBuilder.withMob()
      .setLevel(30)
      .withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)

    // when
    testBuilder.useMob(mob1)
    const responses1 = await doNTimes(
      iterations,
      async () => {
        mob1.setMv(100)
        return testBuilder.handleAction(RequestType.Berserk)
      })
    testBuilder.useMob(mob2)
    const responses2 = await doNTimes(
      iterations,
      async () => {
        mob2.setMv(100)
        return testBuilder.handleAction(RequestType.Berserk)
    })

    // then
    const responseGroup1SuccessCount = responses1.filter(response => response.isSuccessful()).length
    const responseGroup2SuccessCount = responses2.filter(response => response.isSuccessful()).length
    expect(responseGroup1SuccessCount)
      .toBeLessThan(responseGroup2SuccessCount)
  })
})
