import { Mob } from "../mob/model/mob"
import Attempt from "../skill/attempt"
import { newSelfTargetAttempt } from "../skill/factory"
import { Skill } from "../skill/model/skill"
import Outcome from "../skill/outcome"
import AttemptContext from "../skill/attemptContext"
import { Trigger } from "../mob/trigger"

async function repeater(call, count: number = 10) {
  const times = new Array(count)
  for (let i = 0; i < count; i ++) {
    times.push(await call())
  }
  return times
}

export async function getMultipleOutcomesAgainst(
  mob: Mob, target: Mob, skill: Skill, action): Promise<Outcome[]> {
  return repeater(async () => await action(new Attempt(mob, skill, new AttemptContext(Trigger.None, target))))
}

export async function getMultipleOutcomes(mob: Mob, skill: Skill, action): Promise<Outcome[]> {
  return repeater(async () => await action(newSelfTargetAttempt(mob, skill)))
}
