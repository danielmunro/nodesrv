import { AffectType } from "../../affect/affectType"
import { getTestMob } from "../../test/mob"
import { getMultipleOutcomesAgainst } from "../../test/repeater"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"
import trip from "./trip"

describe("trip skill action", () => {
  it("should be able to fail tripping", async () => {
    // given
    const mob = getTestMob()
    const skill = newSkill(SkillType.Trip)
    const target = getTestMob()

    // when
    const outcomes = await getMultipleOutcomesAgainst(mob, target, skill, trip)

    // then
    expect(outcomes.some((outcome) => !outcome.wasSuccessful())).toBeTruthy()
  })

  it("should be able to succeed tripping", async () => {
    // given
    const mob = getTestMob()
    const skill = newSkill(SkillType.Trip, 1)
    const target = getTestMob()

    // when
    const outcomes = await getMultipleOutcomesAgainst(mob, target, skill, trip)

    // then
    expect(outcomes.some((outcome) => outcome.wasSuccessful())).toBeTruthy()
    expect(target.getAffect(AffectType.Dazed)).toBeTruthy()
  })
})
