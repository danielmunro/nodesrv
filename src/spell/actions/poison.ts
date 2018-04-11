import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { newAttributesWithHitrollStats, newHitroll, newStats } from "../../attributes/factory"
import { Check } from "../check"

export default function(check: Check) {
  check.target.addAffect(newAffect(AffectType.Poison, check.spell.level))
  check.target.addAffect(
    newAffect(
      AffectType.Poison,
      check.spell.level,
      newAttributesWithHitrollStats(newHitroll(0, -1), newStats(-1, 0, 0, 0, -1, -1))))
}
