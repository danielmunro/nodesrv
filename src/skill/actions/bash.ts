import roll from "../../random/dice"
import Attempt from "../attempt"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import { SkillType } from "../skillType"
import { Costs, Messages } from "../constants"
import { format } from "../../support/string"

export default async function(attempt: Attempt): Promise<Outcome> {
  const mob = attempt.mob
  const target = attempt.getSubjectAsMob()
  const skill = mob.skills.find((s) => s.skillType === SkillType.Bash)

  if (!skill) {
    return new Outcome(attempt, OutcomeType.Error, Messages.Bash.NoSkill)
  }

  if (roll(1, skill.level) - roll(1, target.getCombinedAttributes().stats.dex * 3) < 0) {
    return new Outcome(attempt, OutcomeType.Failure, Messages.Bash.Fail, Costs.Bash.Delay)
  }

  target.vitals.hp--

  return new Outcome(
    attempt,
    OutcomeType.Success,
    format(Messages.Bash.Success, target.name),
    Costs.Bash.Delay,
  )
}
