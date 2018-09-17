import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { DamageType } from "../../damage/damageType"
import Weapon from "../../item/model/weapon"
import roll from "../../random/dice"
import Attempt from "../attempt"
import Outcome from "../outcome"
import { MESSAGE_FAIL_CANNOT_ENVENOM, MESSAGE_FAIL_NOT_A_WEAPON } from "./constants"

export default async function(attempt: Attempt): Promise<Outcome> {
  const item = attempt.getSubjectAsItem()

  if (!(item instanceof Weapon)) {
    return attempt.createCheckFailOutcome(MESSAGE_FAIL_NOT_A_WEAPON)
  }

  if (item.damageType !== DamageType.Slash && item.damageType !== DamageType.Pierce) {
    return attempt.createCheckFailOutcome(MESSAGE_FAIL_CANNOT_ENVENOM)
  }

  if (roll(1, attempt.skill.level) > item.level) {
    item.affects.push(newAffect(AffectType.Poison, attempt.mob.level))
    return attempt.createSuccessOutcome()
  }

  return attempt.createFailureOutcome()
}