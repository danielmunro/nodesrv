import doNTimes from "../../support/functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"

const iterations = 1000

describe("steal skill action", () => {
  it("should transfer an item when successful", async () => {
    // highly random skill -- will need to run a few iterations
    await doNTimes(iterations, async () => {
      // setup
      const testBuilder = new TestBuilder()
      const definition = await testBuilder.getSkillDefinition(SkillType.Steal)

      // given
      const mobBuilder1 = testBuilder.withMob()
      mobBuilder1.withLevel(5)
      mobBuilder1.withSkill(SkillType.Steal, MAX_PRACTICE_LEVEL)

      // and
      const mobBuilder2 = testBuilder.withMob()
      mobBuilder2.withAxeEq()
      mobBuilder2.mob.name = "bob"

      // when
      const response = await definition.doAction(testBuilder.createRequest(
        RequestType.Steal,
        "steal axe bob",
        mobBuilder2.mob))

      // then
      expect(response.isError()).toBeFalsy()
      expect(mobBuilder1.mob.inventory.items).toHaveLength(response.isSuccessful() ? 1 : 0)
      expect(mobBuilder2.mob.inventory.items).toHaveLength(response.isSuccessful() ? 0 : 1)
    })
  })
})
