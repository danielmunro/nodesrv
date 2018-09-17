import { AffectType } from "../../affect/affectType"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { Mob } from "../../mob/model/mob"
import { getMultipleOutcomes } from "../../test/repeater"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"
import sneak from "./sneak"

describe("sneak skill actions", () => {
  it("should be able to fail sneaking", async () => {
    // given
    const mob = new Mob()
    const skill = newSkill(SkillType.Sneak)

    // when
    const outcomes = await getMultipleOutcomes(mob, skill, sneak)

    // then
    expect(outcomes.some((outcome) => !outcome.wasSuccessful())).toBeTruthy()
  })

  it("should be able to succeed sneaking", async () => {
    // given
    const mob = new Mob()
    const skill = newSkill(SkillType.Sneak, MAX_PRACTICE_LEVEL)

    // when
    const outcomes = await getMultipleOutcomes(mob, skill, sneak)

    // then
    expect(outcomes.some((outcome) => outcome.wasSuccessful())).toBeTruthy()
    expect(mob.getAffect(AffectType.Sneak)).toBeTruthy()
  })
})
