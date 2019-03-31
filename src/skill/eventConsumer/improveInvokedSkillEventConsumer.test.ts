import {RaceType} from "../../mob/race/raceType"
import doNTimes from "../../support/functional/times"
import {getTestMob} from "../../test/mob"
import {newSkill} from "../factory"
import SkillEvent from "../skillEvent"
import {SkillType} from "../skillType"
import ImproveInvokedSkillsEventConsumer from "./improveInvokedSkillsEventConsumer"

const iterations = 500

describe("skill invoked event consumer", () => {
  it("should improve a skill", async () => {
    // setup
    const skillInvokedEventConsumer = new ImproveInvokedSkillsEventConsumer()

    // given
    const skill = newSkill(SkillType.Sneak)
    const mob = getTestMob()

    // when
    await doNTimes(iterations, () => skillInvokedEventConsumer.consume(new SkillEvent(skill, mob, true)))

    // then
    expect(skill.level).toBeGreaterThan(1)
  })

  it("high intelligence mobs should improve faster", async () => {
    // setup
    const skillInvokedEventConsumer = new ImproveInvokedSkillsEventConsumer()

    // given
    const skill1 = newSkill(SkillType.Sneak)
    const mob1 = getTestMob()
    mob1.race = RaceType.Faerie

    // and
    const skill2 = newSkill(SkillType.Sneak)
    const mob2 = getTestMob()
    mob2.race = RaceType.Troll

    // when
    await doNTimes(iterations, async () => {
      await skillInvokedEventConsumer.consume(new SkillEvent(skill1, mob1, true))
      await skillInvokedEventConsumer.consume(new SkillEvent(skill2, mob2, true))
    })

    // then
    expect(skill1.level).toBeGreaterThan(skill2.level)
  })
})
