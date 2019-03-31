import { RaceType } from "./raceType"
import { getSizeModifier } from "./sizeModifier"

export default function(race: RaceType) {
  return getSizeModifier(race, 2, 4, 3)
}
