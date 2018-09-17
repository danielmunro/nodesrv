import roll from "../../random/dice"
import Attempt from "../attempt"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import { SkillType } from "../skillType"
import { Costs, MESSAGE_FAIL, MESSAGE_NO_SKILL } from "./constants"

export default async function(attempt: Attempt): Promise<Outcome> {
  const mob = attempt.mob
  const target = attempt.getSubjectAsMob()
  const skill = mob.skills.find((s) => s.skillType === SkillType.Bash)

  if (!skill) {
    return new Outcome(attempt, OutcomeType.Error, MESSAGE_NO_SKILL)
  }

  if (roll(1, skill.level) - roll(1, target.getCombinedAttributes().stats.dex * 3) < 0) {
    return new Outcome(attempt, OutcomeType.Failure, MESSAGE_FAIL, Costs.Bash.Delay)
  }

  target.vitals.hp--

  return new Outcome(
    attempt,
    OutcomeType.Success,
    `You slam into ${mob.name} and send them flying!`,
    Costs.Bash.Delay,
  )
}
