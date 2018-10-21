import roll from "../../random/dice"
import { Check } from "../check"

export default function(check: Check) {
  check.target.vitals.hp -= roll(2, 6)
}
