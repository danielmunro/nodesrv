import { Attributes } from "./../../attributes/attributes"
import { clericModifier, largeModifier, thiefModifier, tinyModifier, warriorModifier, wizardModifier } from "./modifier"
import { allRaces, isCleric, isLarge, isThief, isTiny, isWarrior, isWizard } from "./race"

describe("race modifiers", () => {
  it("modifiers", () => {
    const testAttributes = Attributes.withNoAttributes()
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
