import { isLarge, isTiny, RaceType } from "./raceType"

export function getSizeModifier(race: RaceType, tinyModifier: number, largeModifier: number, defaultModifier: number = 0) {
  if (isTiny(race)) {
    return tinyModifier
  }

  if (isLarge(race)) {
    return largeModifier
  }

  return defaultModifier
}
