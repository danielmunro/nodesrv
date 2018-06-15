import { AffectType } from "../../affect/affectType"
import { Mob } from "../../mob/model/mob"
import { newSelfTargetAttempt, newSkill } from "../factory"
import Outcome from "../outcome"
import { SkillType } from "../skillType"
import berserk from "./berserk"

async function getMultipleOutcomes(mob: Mob, level: number): Promise<Outcome[]> {
  const skill = newSkill(SkillType.Berserk, level)
  const repeater = async () => await berserk(newSelfTargetAttempt(mob, skill))

  return [
    await repeater(),
    await repeater(),
    await repeater(),
    await repeater(),
    await repeater(),
  ]
}

describe("berserk skill action", () => {
  it("should be able to fail berserking", async () => {
    const mob = new Mob()
    expect((await getMultipleOutcomes(mob, 1)).some((outcome) => !outcome.wasSuccessful())).toBeTruthy()
    expect(mob.getAffect(AffectType.Berserk)).toBeFalsy()
  })

  it("should be able to succeed berserking", async () => {
    const mob = new Mob()
    expect((await getMultipleOutcomes(mob, 100)).some((outcome) => outcome.wasSuccessful())).toBeTruthy()
    expect(mob.getAffect(AffectType.Berserk)).toBeTruthy()
  })
})
