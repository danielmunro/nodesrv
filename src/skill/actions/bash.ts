import roll from "../../dice/dice"
import { getFights } from "../../mob/fight/fight"
import Attempt from "../attempt"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import { SkillType } from "../skillType"

export const DELAY = 2
export const MESSAGE_NO_SKILL = "You bash around helplessly."
export const MESSAGE_NO_TARGET = "You aren't fighting anyone!"
export const MESSAGE_FAIL = "You fall flat on your face!"

export default async function(attempt: Attempt): Promise<Outcome> {
  const sessionMob = attempt.mob
  const fight = getFights().find((f) => f.isParticipant(sessionMob))

  if (!fight) {
    return new Outcome(attempt, OutcomeType.Error, MESSAGE_NO_TARGET)
  }

  const skill = sessionMob.skills.find((s) => s.skillType === SkillType.Bash)

  if (!skill) {
    return new Outcome(attempt, OutcomeType.Error, MESSAGE_NO_SKILL)
  }

  attempt.delay += DELAY
  const target = fight.getOpponentFor(sessionMob)

  if (roll(1, skill.level) - roll(1, target.getCombinedAttributes().stats.dex * 3) < 0) {
    return new Outcome(attempt, OutcomeType.Failure, MESSAGE_FAIL)
  }

  target.vitals.hp--

  return new Outcome(
    attempt,
    OutcomeType.Success,
    "You slam into ${sessionMob.name} and send them flying!",
  )
}
