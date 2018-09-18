import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { Mob } from "../../mob/model/mob"
import { getSizeModifier } from "../../mob/race/sizeModifier"
import roll from "../../random/dice"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import { Costs } from "../constants"

export default async function(attempt: Attempt): Promise<Outcome> {
  const target = attempt.getSubjectAsMob()
  if (calculateTripRoll(attempt.mob, attempt.skill) > calculateDefenseRoll(target)) {
    const amount = attempt.skill.level / 10
    target.addAffect(newAffect(AffectType.Dazed, amount))
    target.vitals.hp -= amount
    return new Outcome(attempt, OutcomeType.Success, `You tripped ${target}!`, Costs.Trip.Delay)
  }

  return new Outcome(attempt, OutcomeType.Failure, `You failed to trip ${target}.`, Costs.Trip.Delay)
}

function calculateDefenseRoll(mob: Mob): number {
  return roll(1, mob.getCombinedAttributes().stats.dex)
}

function calculateTripRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.getCombinedAttributes().stats.dex) + roll(1, skill.level) +
    getSizeModifier(mob.race, -10, 10)
}
