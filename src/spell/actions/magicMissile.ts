import roll from "../../dice/dice"
import { Check } from "../check"

export default function(check: Check) {
  check.target.vitals.hp -= roll(1, 4)
}
