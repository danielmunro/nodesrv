import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { Check } from "../check"

export default function(check: Check) {
  check.target.addAffect(newAffect(AffectType.GiantStrength, check.spell.level))
}
