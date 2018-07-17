import { Race } from "./race"
import { getSizeModifier } from "./sizeModifier"

export default function(race: Race) {
  return getSizeModifier(race, 2, 4, 3)
}
