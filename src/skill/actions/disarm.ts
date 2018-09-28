import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import { format } from "../../support/string"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { Messages, Thresholds } from "./constants"

export default async function(attempt: Attempt): Promise<Outcome> {
  const target = attempt.attemptContext.subject as Mob
  if (calculateDisarm(attempt.mob, target, attempt.skill) < Thresholds.Disarm) {
    return attempt.fail(format(Messages.Disarm.Failure, target.name))
  }

  return attempt.success(format(Messages.Disarm.Success, target.name, target.gender))
}

function calculateDisarm(mob: Mob, target: Mob, skill: Skill): number {
  return roll(2, Math.max(1, mob.level - target.level) + skill.level)
}
