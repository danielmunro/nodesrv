import { allRaces, isLarge, isTiny, isWizard, isCleric, isWarrior, isThief } from "./race"
import { Attributes } from "./../../attributes/attributes"
import { largeModifier, tinyModifier, wizardModifier, clericModifier, warriorModifier, thiefModifier } from "./modifier"

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