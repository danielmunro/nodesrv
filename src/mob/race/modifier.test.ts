import Attributes from "./../../attributes/model/attributes"
import { allRaces } from "./constants"
import { clericModifier, largeModifier, thiefModifier, tinyModifier, warriorModifier, wizardModifier } from "./modifier"
import { isCleric, isLarge, isThief, isTiny, isWarrior, isWizard } from "./raceType"

describe("race modifiers", () => {
  it("modifiers", () => {
    const testAttributes = new Attributes()
    allRaces.forEach((race) => {
      expectRaceModifier(isLarge, largeModifier, race, testAttributes)
      expectRaceModifier(isTiny, tinyModifier, race, testAttributes)
      expectRaceModifier(isWizard, wizardModifier, race, testAttributes)
      expectRaceModifier(isCleric, clericModifier, race, testAttributes)
      expectRaceModifier(isWarrior, warriorModifier, race, testAttributes)
      expectRaceModifier(isThief, thiefModifier, race, testAttributes)
    })
  })
})

function expectRaceModifier(conditional, modifier, race, attributes) {
  if (conditional(race)) {
    expect(modifier(race, attributes)).not.toEqual(attributes)
    return
  }
  expect(modifier(race, attributes)).toEqual(attributes)
}
