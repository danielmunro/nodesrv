import { AffectType } from "../../affect/affectType"
import { Mob } from "../../mob/model/mob"
import { getMultipleOutcomes } from "../../test/repeater"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"
import sneak from "./sneak"

describe("sneak skill action", () => {
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
    const skill = newSkill(SkillType.Sneak, 100)

    // when
    const outcomes = await getMultipleOutcomes(mob, skill, sneak)

    // then
    expect(outcomes.some((outcome) => outcome.wasSuccessful())).toBeTruthy()
    expect(mob.getAffect(AffectType.Sneak)).toBeTruthy()
  })
})
