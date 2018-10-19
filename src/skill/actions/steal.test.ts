import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { getSkillActionDefinition } from "../skillTable"
import { RequestType } from "../../request/requestType"
import doNTimes from "../../functional/times"
import { getFights } from "../../mob/fight/fight"

const iterations = 100

describe("steal skill action", () => {
  it("should transfer an item when successful", async () => {
    // account for randomization by repeating test and verifying outcome based on response
    await doNTimes(iterations, async () => {
      // setup
      const testBuilder = new TestBuilder()
      const definition = await getSkillActionDefinition(SkillType.Steal)

      // given
      const mobBuilder1 = testBuilder.withMob()
      mobBuilder1.atLevel(5)
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

      // if (response.responseAction.wasFightStarted()) {
      //   expect(getFights()).toHaveLength(1)
      // }
    })
  })
})
