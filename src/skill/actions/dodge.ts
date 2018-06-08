import roll from "../../dice/dice"
import Attempt from "../attempt"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import { SkillType } from "../skillType"

export default async function(attempt: Attempt): Promise<Outcome> {
  const dex = attempt.mob.getCombinedAttributes().stats.dex
  const level = attempt.skill.level
  const targetDex = attempt.target.getCombinedAttributes().stats.dex
  const targetLevel = attempt.target.skills.find((skill) => skill.skillType === SkillType.Dodge).level

  if (roll(1, dex) + roll(1, level) > roll(1, targetDex) + roll(1, targetLevel)) {
    return new Outcome(attempt, OutcomeType.Success, "you dodged!")
  }

  return new Outcome(attempt, OutcomeType.Failure, "you failed")
}
