import { Race, isWarrior, isThief, isWizard, isCleric, isTiny, isLarge } from "./race"
import { Attributes } from "../../attributes/attributes"
import { HitDam } from "../../attributes/hitdam"
import { Stats } from "../../attributes/stats"

export interface Modifier {
  (race: Race, attributes: Attributes): Attributes
}

function combineWithStats(attributes: Attributes, stats: Stats): Attributes {
  return attributes.combine(Attributes.withStats(stats))
}

export const warriorModifier = (race: Race, attributes: Attributes): Attributes => {
  if (isWarrior(race)) {
    return attributes.combine(
      Attributes.withHitDamStats(
        new HitDam(1, 0),
        new Stats(2, -2, -1, 0, 1, 0)))
  }
  return attributes
}

export const thiefModifier = (race: Race, attributes: Attributes): Attributes => {
  if (isThief(race)) {
    return combineWithStats(attributes, new Stats(0, -1, -2, 2, 0, 1))
  }
  return attributes
}

export const wizardModifier = (race: Race, attributes: Attributes): Attributes => {
  if (isWizard(race)) {
    return combineWithStats(attributes, new Stats(-2, 2, 1, 0, -1, 0))
  }
  return attributes
}

export const clericModifier = (race: Race, attributes: Attributes): Attributes => {
  if (isCleric(race)) {
    return combineWithStats(attributes, new Stats(-1, 1, 2, -1, -1, 0))
  }
  return attributes
}

export const tinyModifier = (race: Race, attributes: Attributes): Attributes => {
  if (isTiny(race)) {
    return combineWithStats(attributes, new Stats(-1, 0, 0, 1, -1, 1))
  }
  return attributes
}

export const largeModifier = (race: Race, attributes: Attributes): Attributes => {
  if (isLarge(race)) {
    return combineWithStats(attributes, new Stats(1, 0, 0, -1, 1, -1))
  }
  return attributes
}

export const modifiers = [
  warriorModifier,
  thiefModifier,
  wizardModifier,
  clericModifier,
  tinyModifier,
  largeModifier,
]