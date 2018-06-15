import { AffectType } from "../../affect/affectType"
import { Mob } from "../../mob/model/mob"
import repeater from "../../test/repeater"
import { newSelfTargetAttempt, newSkill } from "../factory"
import Outcome from "../outcome"
import { SkillType } from "../skillType"
import sneak from "./sneak"

async function getMultipleOutcomes(mob: Mob, level: number): Promise<Outcome[]> {
  const skill = newSkill(SkillType.Sneak, level)
  return repeater(async () => await sneak(newSelfTargetAttempt(mob, skill)))
}

describe("sneak skill action", () => {
  it("should be able to fail sneaking", async () => {
    const mob = new Mob()
    expect((await getMultipleOutcomes(mob, 1)).some((outcome) => !outcome.wasSuccessful())).toBeTruthy()
    expect(mob.getAffect(AffectType.Sneak)).toBeFalsy()
  })

  it("should be able to succeed sneaking", async () => {
    const mob = new Mob()
    expect((await getMultipleOutcomes(mob, 100)).some((outcome) => outcome.wasSuccessful())).toBeTruthy()
    expect(mob.getAffect(AffectType.Sneak)).toBeTruthy()
  })
})
