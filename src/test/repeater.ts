import { Mob } from "../mob/model/mob"
import { newSelfTargetAttempt, newSkill } from "../skill/factory"
import Outcome from "../skill/outcome"
import { SkillType } from "../skill/skillType"

export default async function repeater(call, count: number = 5) {
  const times = new Array(count)
  times.fill(await call())
  return times
}

export async function getMultipleOutcomes(mob: Mob, skillType: SkillType, action, level: number): Promise<Outcome[]> {
  return repeater(async () => await action(newSelfTargetAttempt(mob, newSkill(skillType, level))))
}
