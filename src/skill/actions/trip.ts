import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import roll from "../../random/dice"
import { Mob } from "../../mob/model/mob"
import { getSizeModifier } from "../../mob/race/sizeModifier"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"

const DELAY = 1

export default async function(attempt: Attempt): Promise<Outcome> {
  if (calculateTripRoll(attempt.mob, attempt.skill) > calculateDefenseRoll(attempt.target)) {
    const amount = attempt.skill.level / 10
    attempt.target.addAffect(newAffect(AffectType.Dazed, amount))
    attempt.target.vitals.hp -= amount
    return new Outcome(attempt, OutcomeType.Success, `You tripped ${attempt.target}!`, DELAY)
  }

  return new Outcome(attempt, OutcomeType.Failure, `You failed to trip ${attempt.target}.`, DELAY)
}

function calculateDefenseRoll(mob: Mob): number {
  return roll(1, mob.getCombinedAttributes().stats.dex)
}

function calculateTripRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.getCombinedAttributes().stats.dex) + roll(1, skill.level) +
    getSizeModifier(mob.race, -10, 10)
}
