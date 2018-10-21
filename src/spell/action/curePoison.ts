import { AffectType } from "../../affect/affectType"
import { Check } from "../check"

export default function(check: Check) {
  check.target.affects = check.target.affects.filter((a) => a.affectType !== AffectType.Poison)
}
