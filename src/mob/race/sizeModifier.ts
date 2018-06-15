import { isLarge, isTiny, Race } from "./race"

export function getSizeModifier(race: Race, tinyModifier: number, largeModifier: number, defaultModifier: number = 0) {
  if (isTiny(race)) {
    return tinyModifier
  }

  if (isLarge(race)) {
    return largeModifier
  }

  return defaultModifier
}
