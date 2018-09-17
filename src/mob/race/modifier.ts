import { newAttributesWithHitrollStats, newAttributesWithStats } from "../../attributes/factory"
import Attributes from "../../attributes/model/attributes"
import Hitroll from "../../attributes/model/hitroll"
import Stats from "../../attributes/model/stats"
import { isCleric, isLarge, isThief, isTiny, isWarrior, isWizard, Race } from "./race"

function combineWithStats(attributes: Attributes, stats: Stats): Attributes {
  return attributes.combine(newAttributesWithStats(stats))
}

export const warriorModifier = (race: Race, attributes: Attributes): Attributes => {
  if (isWarrior(race)) {
    return attributes.combine(
      newAttributesWithHitrollStats(Hitroll.create(1, 0), Stats.create(2, -2, -1, 0, 1, 0)))
  }
  return attributes
}

export const thiefModifier = (race: Race, attributes: Attributes): Attributes => {
  if (isThief(race)) {
    return combineWithStats(attributes, Stats.create(0, -1, -2, 2, 0, 1))
  }
  return attributes
}

export const wizardModifier = (race: Race, attributes: Attributes): Attributes => {
  if (isWizard(race)) {
    return combineWithStats(attributes, Stats.create(-2, 2, 1, 0, -1, 0))
  }
  return attributes
}

export const clericModifier = (race: Race, attributes: Attributes): Attributes => {
  if (isCleric(race)) {
    return combineWithStats(attributes, Stats.create(-1, 1, 2, -1, -1, 0))
  }
  return attributes
}

export const tinyModifier = (race: Race, attributes: Attributes): Attributes => {
  if (isTiny(race)) {
    return combineWithStats(attributes, Stats.create(-1, 0, 0, 1, -1, 1))
  }
  return attributes
}

export const largeModifier = (race: Race, attributes: Attributes): Attributes => {
  if (isLarge(race)) {
    return combineWithStats(attributes, Stats.create(1, 0, 0, -1, 1, -1))
  }
  return attributes
}
