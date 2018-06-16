import { Mob } from "../mob/model/mob"
import Attempt from "../skill/attempt"
import { newSelfTargetAttempt, newSkill } from "../skill/factory"
import Outcome from "../skill/outcome"
import { SkillType } from "../skill/skillType"

async function repeater(call, count: number = 5) {
  const times = new Array(count)
  for (let i = 0; i < count; i ++) {
    times.push(await call())
  }
  return times
}

export async function getMultipleOutcomesAgainst(
  mob: Mob, target: Mob, skillType: SkillType, action, level: number): Promise<Outcome[]> {
  return repeater(async () => await action(new Attempt(mob, target, newSkill(skillType, level))))
}

export async function getMultipleOutcomes(mob: Mob, skillType: SkillType, action, level: number): Promise<Outcome[]> {
  return repeater(async () => await action(newSelfTargetAttempt(mob, newSkill(skillType, level))))
}
