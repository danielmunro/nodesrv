import AttributeBuilder from "../attributes/attributeBuilder"
import {
  newAttributes,
  newHitroll,
  newStartingStats,
  newStartingVitals,
} from "../attributes/factory"
import { Item } from "../item/model/item"
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
      expectedAttributes)

    expect(mob.name).toBe(name)
    expect(mob.description).toBe(description)
    expect(mob.race).toBe(race)
    expect(mob.vitals).toBe(vitals)
    expect(mob.getCombinedAttributes()).toEqual(expectedAttributes)
  })

  it("should be able to newTable with items", () => {
    const testItem1 = new Item()
    const testItem2 = new Item()
    const mob = newMob(
      "",
      "",
      Race.Critter,
      newStartingVitals(),
      new AttributeBuilder().setStats(newStartingStats()).build(),
      false,
      [testItem1, testItem2])

    expect(mob.inventory.items.length).toBe(2)
    expect(mob.inventory.items[0]).toBe(testItem1)
    expect(mob.inventory.items[1]).toBe(testItem2)
  })
})
