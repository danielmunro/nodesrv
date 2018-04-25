import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { newAttributesWithStats, newStats } from "../../attributes/factory"
import { Check } from "../check"

export default function(check: Check) {
  const bonus = Math.ceil(check.spell.level / 2)
  check.applyManaCost()
  check.target.addAffect(
    newAffect(
      AffectType.GiantStrength,
      check.spell.level,
      newAttributesWithStats(newStats(bonus, 0, 0, 0, 0, 0))))
}
