import { AffectType } from "../../affect/affectType"
import { Mob } from "../../mob/model/mob"
import { getMultipleOutcomes } from "../../test/repeater"
import { SkillType } from "../skillType"
import sneak from "./sneak"

describe("sneak skill action", () => {
  it("should be able to fail sneaking", async () => {
    const mob = new Mob()
    expect((await getMultipleOutcomes(mob, SkillType.Sneak, sneak, 1)).some(
      (outcome) => !outcome.wasSuccessful())).toBeTruthy()
  })

  it("should be able to succeed sneaking", async () => {
    const mob = new Mob()
    expect((await getMultipleOutcomes(mob, SkillType.Sneak, sneak, 100)).some(
      (outcome) => outcome.wasSuccessful())).toBeTruthy()
    expect(mob.getAffect(AffectType.Sneak)).toBeTruthy()
  })
})
