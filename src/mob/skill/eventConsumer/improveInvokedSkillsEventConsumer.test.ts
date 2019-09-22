import {createSkillEvent} from "../../../event/factory/eventFactory"
import doNTimes from "../../../support/functional/times"
import {getTestMob} from "../../../support/test/mob"
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
    mob1.attributes[0].int = 25

    // and
    const skill2 = newSkill(SkillType.Sneak)
    const mob2 = getTestMob()
    mob2.attributes[0].int = 0

    // when
    let mob1Improve = 0
    let mob2Improve = 0
    await doNTimes(iterations, async () => {
      mob1Improve += await skillInvokedEventConsumer.isEventConsumable(createSkillEvent(skill1, mob1, true)) ? 1 : 0
      mob2Improve += await skillInvokedEventConsumer.isEventConsumable(createSkillEvent(skill2, mob2, true)) ? 1 : 0
    })

    // then
    expect(mob1Improve).toBeGreaterThan(mob2Improve)
  })
})
