import {
  newAttributes,
  newAttributesWithStats, newEmptyAttributes,
  newHitroll,
  newStartingStats,
  newStartingVitals,
} from "../attributes/factory"
import { newWeapon } from "../item/factory"
import { newMob } from "./factory"
import { Race } from "./race/race"

describe("mob factory", () => {
  it("should be able to create a mob", () => {
    const name = "test mob name"
    const description = "this is a description"
    const race = Race.Critter
    const vitals = newStartingVitals()
    const expectedAttributes = newAttributes(
      newStartingVitals(),
      newStartingStats(),
      newHitroll(0, 0))
    const mob = newMob(
      name,
      description,
      race,
      vitals,
      newEmptyAttributes())

    expect(mob.name).toBe(name)
    expect(mob.description).toBe(description)
    expect(mob.race).toBe(race)
    expect(mob.vitals).toBe(vitals)
    expect(mob.getCombinedAttributes()).toEqual(expectedAttributes)
  })

  it("should be able to make a wandering mob", () => {
    const mob = newMob("", "", Race.Critter, newStartingVitals(), newAttributesWithStats(newStartingStats()), true)
    expect(mob.wanders).toBe(true)
  })

  it("should be able to initialize with items", () => {
    const testItem1 = newWeapon("", "")
    const testItem2 = newWeapon("", "")
    const mob = newMob(
      "",
      "",
      Race.Critter,
      newStartingVitals(),
      newAttributesWithStats(newStartingStats()),
      false,
      [testItem1, testItem2])

    expect(mob.inventory.items.length).toBe(2)
    expect(mob.inventory.items[0]).toBe(testItem1)
    expect(mob.inventory.items[1]).toBe(testItem2)
  })
})
