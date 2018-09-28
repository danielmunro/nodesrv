import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import Attempt from "../attempt"
import { Costs, Messages } from "../constants"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { Thresholds } from "./constants"

export default async function(attempt: Attempt): Promise<Outcome> {
  if (calculateBerserkRoll(attempt.mob, attempt.skill) > Thresholds.Berserk) {
    attempt.mob.addAffect(newAffect(AffectType.Berserk, attempt.mob.level / 10))
    return attempt.success(Messages.Berserk.Success, Costs.Berserk.Delay)
  }

  return attempt.fail(Messages.Berserk.Fail, Costs.Berserk.Delay)
}

function calculateBerserkRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.level) + roll(2, skill.level)
}
