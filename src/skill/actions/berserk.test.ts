import { AffectType } from "../../affect/affectType"
import { Mob } from "../../mob/model/mob"
import { getMultipleOutcomes } from "../../test/repeater"
import { SkillType } from "../skillType"
import berserk from "./berserk"

describe("berserk skill action", () => {
  it("should be able to fail berserking", async () => {
    const mob = new Mob()
    expect((await getMultipleOutcomes(mob, SkillType.Berserk, berserk, 1)).some(
      (outcome) => !outcome.wasSuccessful())).toBeTruthy()
    expect(mob.getAffect(AffectType.Berserk)).toBeFalsy()
  })

  it("should be able to succeed berserking", async () => {
    const mob = new Mob()
    expect((await getMultipleOutcomes(mob, SkillType.Berserk, berserk, 100)).some(
      (outcome) => outcome.wasSuccessful())).toBeTruthy()
    expect(mob.getAffect(AffectType.Berserk)).toBeTruthy()
  })
})
