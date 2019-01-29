import doNTimes from "../../support/functional/times"
import {newSkill} from "../factory"
import SkillEvent from "../skillEvent"
import {SkillType} from "../skillType"
import SkillInvokedEventConsumer from "./skillInvokedEventConsumer"

const iterations = 1000

describe("skill invoked event consumer", () => {
  it("should improve a skill", async () => {
    // setup
    const skillInvokedEventConsumer = new SkillInvokedEventConsumer()

    // given
    const skill = newSkill(SkillType.Sneak)

    // when
    await doNTimes(iterations, () => skillInvokedEventConsumer.consume(new SkillEvent(skill, true)))

    // then
    expect(skill.level).toBeGreaterThan(1)
  })
})
