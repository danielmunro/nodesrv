import {createSkillEvent} from "../../event/factory"
import doNTimes from "../../support/functional/times"
import {getTestMob} from "../../support/test/mob"
import {newSkill} from "../factory"
import {SkillType} from "../skillType"
import ImproveInvokedSkillsEventConsumer from "./improveInvokedSkillsEventConsumer"

const iterations = 1000

describe("skill invoked event consumer", () => {
  it("should improve a skill", async () => {
    // setup
    const skillInvokedEventConsumer = new ImproveInvokedSkillsEventConsumer()

    // given
    const skill = newSkill(SkillType.Sneak)
    const mob = getTestMob()

    // when
    await doNTimes(iterations, () => skillInvokedEventConsumer.consume(createSkillEvent(skill, mob, true)))

    // then
    expect(skill.level).toBeGreaterThan(1)
  })

  it("high intelligence mobs should improve faster", async () => {
    // setup
    const skillInvokedEventConsumer = new ImproveInvokedSkillsEventConsumer()

    // given
    const skill1 = newSkill(SkillType.Sneak)
    const mob1 = getTestMob()
    mob1.attributes[0].stats.int = 25

    // and
    const skill2 = newSkill(SkillType.Sneak)
    const mob2 = getTestMob()
    mob2.attributes[0].stats.int = 0

    // when
    await doNTimes(iterations, async () => {
      await skillInvokedEventConsumer.consume(createSkillEvent(skill1, mob1, true))
      await skillInvokedEventConsumer.consume(createSkillEvent(skill2, mob2, true))
    })

    // then
    expect(skill1.level).toBeGreaterThan(skill2.level)
  })
})
