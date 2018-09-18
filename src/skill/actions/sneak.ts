import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { Mob } from "../../mob/model/mob"
import { getSizeModifier } from "../../mob/race/sizeModifier"
import roll from "../../random/dice"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import { Costs, Messages } from "./constants"

const SUCCESS_THRESHOLD = 50

export default async function(attempt: Attempt): Promise<Outcome> {
  if (calculateSneakRoll(attempt.mob, attempt.skill) > SUCCESS_THRESHOLD) {
    attempt.mob.addAffect(newAffect(AffectType.Sneak, attempt.mob.level))
    return new Outcome(attempt, OutcomeType.Success, Messages.Sneak.Success, Costs.Sneak.Delay)
  }

  return new Outcome(attempt, OutcomeType.Failure, Messages.Sneak.Fail, Costs.Sneak.Delay)
}

function calculateSneakRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.level) + roll(2, skill.level) - getSizeModifier(mob.race, 10, -10)
}
