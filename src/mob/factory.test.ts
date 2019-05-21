import AttributeBuilder from "../attributes/builder/attributeBuilder"
import {
  newHitroll,
  newStartingStats,
  newStartingVitals,
} from "../attributes/factory/attributeFactory"
import { Item } from "../item/model/item"
import { newMob } from "./factory"
import { RaceType } from "./race/enum/raceType"

describe("mob factory", () => {
  it("should be able to create a mob", () => {
    const name = "test mob name"
    const description = "this has a description"
    const race = RaceType.Critter
    const vitals = newStartingVitals()
    const expectedAttributes = new AttributeBuilder()
        .setVitals(newStartingVitals())
        .setStats(newStartingStats())
      .setHitRoll(newHitroll(0, 0))
      .build()
    const mob = newMob(
      name,
      description,
      race,
      vitals,
      expectedAttributes)

    expect(mob.name).toBe(name)
    expect(mob.description).toBe(description)
    expect(mob.raceType).toBe(race)
    expect(mob.vitals).toBe(vitals)
    expect(mob.attribute().combine()).toEqual(expectedAttributes)
  })

  it("should be able to newTable with items", () => {
    const testItem1 = new Item()
    const testItem2 = new Item()
    const mob = newMob(
      "",
      "",
      RaceType.Critter,
      newStartingVitals(),
      new AttributeBuilder().setStats(newStartingStats()).build(),
      false,
      [testItem1, testItem2])

    expect(mob.inventory.items.length).toBe(2)
    expect(mob.inventory.items[0]).toBe(testItem1)
    expect(mob.inventory.items[1]).toBe(testItem2)
  })
})
