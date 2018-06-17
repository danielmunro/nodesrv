import roll from "../../dice/dice"
import Attempt from "../attempt"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import { SkillType } from "../skillType"

export const DELAY = 2
export const MESSAGE_NO_SKILL = "You bash around helplessly."
export const MESSAGE_NO_TARGET = "You aren't fighting anyone!"
export const MESSAGE_FAIL = "You fall flat on your face!"

export default async function(attempt: Attempt): Promise<Outcome> {
  const mob = attempt.mob
  const target = attempt.target
  const skill = mob.skills.find((s) => s.skillType === SkillType.Bash)

  if (!skill) {
    return new Outcome(attempt, OutcomeType.Error, MESSAGE_NO_SKILL)
  }

  if (roll(1, skill.level) - roll(1, target.getCombinedAttributes().stats.dex * 3) < 0) {
    return new Outcome(attempt, OutcomeType.Failure, MESSAGE_FAIL, DELAY)
  }

  target.vitals.hp--

  return new Outcome(
    attempt,
    OutcomeType.Success,
    `You slam into ${mob.name} and send them flying!`,
    DELAY,
  )
}
