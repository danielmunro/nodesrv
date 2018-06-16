import { AffectType } from "../../affect/affectType"
import { getTestMob } from "../../test/mob"
import { getMultipleOutcomesAgainst } from "../../test/repeater"
import { SkillType } from "../skillType"
import trip from "./trip"

describe("trip skill action", () => {
  it("should be able to fail tripping", async () => {
    const mob = getTestMob()
    const target = getTestMob()
    expect((await getMultipleOutcomesAgainst(mob, target, SkillType.Trip, trip, 1)).some(
      (outcome) => !outcome.wasSuccessful())).toBeTruthy()
  })

  it("should be able to succeed tripping", async () => {
    const mob = getTestMob()
    const target = getTestMob()
    expect((await getMultipleOutcomesAgainst(mob, target, SkillType.Trip, trip, 100)).some(
      (outcome) => outcome.wasSuccessful())).toBeTruthy()
    expect(target.getAffect(AffectType.Dazed)).toBeTruthy()
  })
})
